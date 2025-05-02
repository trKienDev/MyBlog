import api_configs from "../../api/api.config.js";
import { getSelectedOptionValue, initSelectSearch, resetSelectSearch } from "../../components/select-search.component.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { showToast } from "../../utils/toast-notification.js";
import { getCodeByStudio, getSelectedCodeOption, getSelectedTags, resetTagSelection } from "../films/films.js";
import { getDateFromStr } from "../../utils/date.js";
import css_selectors from "../../selectors/css.selectors.js";
import fetch_api from "../../api/fetch.api.js";
import table_component from "../../components/table.component.js";
import { film_api } from "../../api/film.api.js";
import { studio_api } from "../../api/studio.api.js";
import tags_utils from "../../utils/tags.utils.js";

export function initCreateVideo() {
      initSearchFilm();
      searchFilm();
      initSelectSearch(id_selectors.videos.video_action, api_configs.endpoints.getTagsByAction, 'name');
      initSelectSearch(id_selectors.videos.video_creator, api_configs.endpoints.getCreators, 'name');
      initSelectSearch(id_selectors.videos.video_tag, api_configs.endpoints.getTagsByVideo, 'name');
      initSelectSearch(id_selectors.videos.video_playlist, api_configs.endpoints.getPlaylists, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.videos.video_tag);
      waitForUploadVideo();
      createVideo();
}

// Core function
function createVideo() {
      const submitVideo_btn = document.getElementById(id_selectors.videos.submit_video_btn);
      submitVideo_btn.addEventListener('click', async () => {
            const video_info = collectVideoInfo();
            const video_form = buildVideoForm(video_info);

            try { 
                  const result = await fetch_api.createForm(api_configs.endpoints.createVideo, video_form);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert("Video created successfully");
                  resetVideoPreview();
                  resetTagSelection();
                  resetSelectSearch([
                        { id: id_selectors.videos.video_action, placeholder: "Select Action" },
                        { id: id_selectors.videos.video_playlist, placeholder: "Select Playlist" },
                  ]);
            } catch(error) {
                  console.error('Error creating video: ', error.message);
                  error_sweetAlert(error);
            }
      });
}

// Search film
async function initSearchFilm() {
      try {
            initSelectSearch(id_selectors.films.film_studio, api_configs.endpoints.getStudios, 'name');
            getCodeByStudio(id_selectors.films.film_studio);
      } catch(error) {
            console.error('Error initSearchFilm: ', error);
            error_sweetAlert(error);
      }
}
async function searchFilm() {
      const search_btn = document.getElementById(id_selectors.films.search_film);
      search_btn.addEventListener('click', async () => {
            const studio = document.getElementById(id_selectors.films.film_studio),
            studio_id = studio.querySelector('span').getAttribute('item-id');
            if(!studio_id) {
                  showToast('Please select studio', 'warning');
            }
            const code_id = getSelectedCodeOption(id_selectors.films.film_code).value;
            try {
                  const films = await film_api.getFilmsByStudioCode(studio_id, code_id);
                  renderFilmTable(films);
            } catch(error) {
                  error_sweetAlert(error);
            }
      });
}
async function renderFilmTable(films) {
      const tbody = document.querySelector(`#${id_selectors.table.search_film} tbody`);
      tbody.innerHTML = '';

      for (const film of films) {
            const { tr, checkbox } = await createFilmRow(film);
            bindFilmRowEvents(tr, checkbox, film);
            tbody.appendChild(tr);
      }
}

// Render film table
async function createFilmRow(film) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', film._id);

      tr.appendChild(table_component.createTextTd({ i_text: film.name }));

      const film_studio = await studio_api.getStudioById(film.studio_id);
      tr.appendChild(table_component.createTextTd({ i_text: film_studio.name, i_id: film.studio_id }));

      const formatted_date = getDateFromStr(new Date(film.date));
      tr.appendChild(table_component.createTextTd({ i_text: formatted_date }));

      tr.appendChild(table_component.createTextTd({ i_text: film.rating }));

      const select_td = document.createElement('td');
      select_td.classList.add(css_selectors.films.film_select);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      select_td.appendChild(checkbox);
      tr.appendChild(select_td);

      return { tr, checkbox };
}
function bindFilmRowEvents(tr, checkbox, film) {
      tr.addEventListener('click', () => {
            const is_selected = tr.classList.contains('selected');
    
            document.querySelectorAll(`#${id_selectors.table.search_film} tbody input[type="checkbox"]`)
                              .forEach(cb => cb.checked = false);
    
            document.querySelectorAll(`#${id_selectors.table.search_film} tbody tr`)
                              .forEach(r => r.classList.remove('selected'));
    
            if (!is_selected) {
                  checkbox.checked = true;
                  tr.classList.add('selected');
            }
    
            const thumbnail_element = document.getElementById(id_selectors.thumbnail.thumbnail_image);
            thumbnail_element.src = `${api_configs.server}/uploads/film/${film.thumbnail}`;
            thumbnail_element.alt = `${film.name} thumbnail`;
      });
}

// upload video
function waitForUploadVideo() {
      const thumbnail = document.getElementById(id_selectors.videos.thumbnail_video);
      const upload_input = document.getElementById(id_selectors.videos.upload_video);

      thumbnail.addEventListener('click', () => {
            upload_input.click();
      });

      upload_input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type === 'video/mp4') {
                  const video_element = document.querySelector('video');
                  const source_element = video_element.querySelector('source');
                  const thumbnail_image = document.getElementById('thumbnail-video');

                  const video_url = URL.createObjectURL(file);

                  source_element.src = video_url;

                  video_element.load();

                  video_element.classList.remove('d-none');
                  thumbnail_image.style.display = 'none';
            } else {
                  showToast('Please upload a valid mp4 video', 'error');
            }
      });
}

// create video
function collectVideoInfo() {
      const tag_ids = getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);
      if(tag_ids.length === 0) {
            showToast('Please select at least a tag', 'warning');
            return;
      }

      const upload_input = document.getElementById(id_selectors.videos.upload_video);
      const file = upload_input.files[0];
      if(!file) {
            showToast('Please upload your video', 'warning');
            return;
      }
      
      const action_id = getSelectedOptionValue(id_selectors.videos.video_action, 'id');
      const action_text = getSelectedOptionValue(id_selectors.videos.video_action, 'text');

      const film_table = document.getElementById(id_selectors.table.search_film),
      selected_film = film_table.querySelector('tr.selected');
      const film_id = selected_film.getAttribute('data-id');
      const film_info = selected_film.querySelectorAll('td')
      const film_name = film_info[0].textContent.trim();
      const studio_id = film_info[1].getAttribute('data-id');

      const video_name = film_name + '_' + action_text;

      const playlist_id = getSelectedOptionValue(id_selectors.videos.video_playlist, 'id');
      const creator_id = getSelectedOptionValue(id_selectors.videos.video_creator, 'id');

      return { video_name, film_id, studio_id, action_id, playlist_id, creator_id, tag_ids, file };
}
function buildVideoForm(video_info) {
      const video_form = new FormData();
      video_form.append("name", video_info.video_name);
      video_form.append("film_id", video_info.film_id);
      video_form.append("studio_id", video_info.studio_id);
      video_form.append("action_id", video_info.action_id);
      video_form.append("playlist_id", video_info.playlist_id);
      video_form.append("creator_id", video_info.creator_id);
      video_form.append("tag_ids", video_info.tag_ids);
      video_form.append("file", video_info.file);

      return video_form;
}

// reset form
function resetVideoPreview() {
      const video_element = document.querySelector('video');
      const source_element = video_element.querySelector('source');
      const thumbnail_image = document.getElementById(id_selectors.videos.thumbnail_video);
      const upload_input = document.getElementById(id_selectors.videos.upload_video);

      source_element.src = "";
      video_element.load();

      video_element.classList.add('d-none');
      thumbnail_image.style.display = "";
      upload_input.value = "";
}


import api_configs from "../../api/api.config.js";
import creator_api from "../../api/creator.api.js";
import { film_api } from "../../api/film.api.js";
import playlist_api from "../../api/playlist.api.js";
import { studio_api } from "../../api/studio.api.js";
import tag_api from "../../api/tag.api.js";
import { video_api } from "../../api/video.api.js";
import selectSearch_component from "../../components/select-search.component.js";
import select_component from "../../components/select.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { loadContentFromUrl } from "../../services/loadElement/load-dynamic-section.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import tags_utils from "../../utils/tags.utils.js";
import { showToast } from "../../utils/toast-notification.js";
import { getCodeByStudio } from "../films/films.js";
import tag_helper from "../tags/tag.helper.js";
import video_helpers from "./video.helper.js";

const endpoint = api_configs.endpoints.adminEditVideoPage;

export function redirectToEditVideoPage(ivideo) {
      loadContentFromUrl(endpoint, () => initEditVideoAdmin(ivideo)); // truyền initEditVideoAdmin như là 1 hàm callback trong loadContentFromUrl 
}

async function initEditVideoAdmin(ivideo) {
      const search_btn = video_helpers.createSearchFilmBtn(id_selectors.films.search_film);
      selectSearch_component.initSelectSearch(id_selectors.videos.video_action, api_configs.endpoints.getTagsByAction, 'name');
      selectSearch_component.initSelectSearch(id_selectors.videos.video_creator, api_configs.endpoints.getCreators, 'name');
      selectSearch_component.initSelectSearch(id_selectors.videos.video_tag, api_configs.endpoints.getTagsByVideo, 'name');
      selectSearch_component.initSelectSearch(id_selectors.videos.video_playlist, api_configs.endpoints.getPlaylists, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.videos.video_tag);
      waitForUploadNewVideo();

      populateFilmInfo(ivideo);
      populateVideoInfo(ivideo);
      updateVideo(ivideo);

}

async function populateFilmInfo(ivideo) {
      await selectSearch_component.loadInfoSelectSearch(ivideo, id_selectors.films.film_studio, 'studio_id', studio_api.getStudioNameById);
      await select_component.selectCodeByStudio(id_selectors.films.film_code, ivideo.studio_id);
      select_component.getCodeOptionByStudoId(id_selectors.films.film_code, ivideo.code_id);
      getCodeByStudio(id_selectors.films.film_studio);
      try {
            const film = await film_api.findFilmById(ivideo.film_id);
            renderFilmOfUpdatedVideo(film);
      } catch(error) {
            console.error('Error in renderFilmTable: ', error);
            showToast(error, 'error');
      }
}

async function populateVideoInfo(ivideo) {
      await selectSearch_component.loadInfoSelectSearch(ivideo, id_selectors.videos.video_action, 'action_id', tag_api.getTagName);
      await selectSearch_component.loadInfoSelectSearch(ivideo, id_selectors.videos.video_playlist, 'playlist_id', playlist_api.getPlaylistName);
      await selectSearch_component.loadInfoSelectSearch(ivideo, id_selectors.videos.video_creator, 'creator_id', creator_api.getCreatorName);

      const selectTag_container = document.getElementById(id_selectors.container.selected_tag);    
      await tag_helper.renderSelectedTags(ivideo.tag_ids, selectTag_container);

      const video_url = `${api_configs.server}/uploads/videos/${ivideo.file_path}`;
      const video_element = document.querySelector('video');
      const source_element = video_element.querySelector('source');
      const thumbnail_image = document.getElementById(id_selectors.videos.thumbnail_video);
      source_element.src = video_url;

      video_element.load();

      video_element.classList.remove('d-none');
      thumbnail_image.style.display = 'none';
}

async function renderFilmOfUpdatedVideo(ifilm) {
      const tbody = document.querySelector(`#${id_selectors.table.search_film} tbody`);
      tbody.innerHTML = '';

      const { tr, checkbox } = await video_helpers.createFilmTr(ifilm);
      checkbox.checked = true;
      tr.classList.add('selected');

      video_helpers.loadThumbnailOfSelectedFIlm(ifilm);

      tbody.appendChild(tr);
}

function updateVideo(ivideo) {
      const submitVideo_btn = document.getElementById(id_selectors.videos.submit_video_btn);
      submitVideo_btn.addEventListener('click', async() => {
            const video_info = collectVideoInfo();
            const video_form = buildVideoForm(video_info);

            try {
                  const result = await video_api.updateVideo(ivideo._id, video_form);
                  success_sweetAlert('video updated');
            } catch(error) {
                  console.error('Error updating video: ', error);
                  error_sweetAlert(error);
            }
      });
}

function waitForUploadNewVideo() {
      const upload_btn = document.getElementById('upload-new_video');
      const upload_input = document.getElementById(id_selectors.videos.upload_video);
      upload_btn.addEventListener('click', () => {
            upload_input.click();
      });

      upload_input.addEventListener('change', video_helpers.handleVideoUpload);
}

function collectVideoInfo() {
      const tag_ids = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);
      if(tag_ids.length === 0) {
            showToast('Please select at least a tag', 'warning');
            return;
      }

      const upload_input = document.getElementById(id_selectors.videos.upload_video);
      const file = upload_input.files[0];
      
      const action_id = selectSearch_component.getSelectedOptionValue(id_selectors.videos.video_action, 'id');
      const action_text = selectSearch_component.getSelectedOptionValue(id_selectors.videos.video_action, 'text');

      const film_table = document.getElementById(id_selectors.table.search_film),
      selected_film = film_table.querySelector('tr.selected');
      const film_id = selected_film.getAttribute('film-id');
      const film_info = selected_film.querySelectorAll('td');
      const film_name = film_info[0].textContent.trim();
      
      const studio_td = film_info[1];
      const studio_id = studio_td.querySelector('span').getAttribute('data-id');
      const code_id = selected_film.getAttribute('code-id');

      const video_name = film_name + '_' + action_text;

      const playlist_id = selectSearch_component.getSelectedOptionValue(id_selectors.videos.video_playlist, 'id');
      const creator_id = selectSearch_component.getSelectedOptionValue(id_selectors.videos.video_creator, 'id');

      return { video_name, film_id, code_id, studio_id, action_id, playlist_id, creator_id, tag_ids, file };
}

function buildVideoForm(video_info) {     
      const video_form = new FormData();
      video_form.append("name", video_info.video_name);
      video_form.append("film_id", video_info.film_id);
      video_form.append("code_id", video_info.code_id);
      video_form.append("studio_id", video_info.studio_id);
      video_form.append("action_id", video_info.action_id);
      video_form.append("playlist_id", video_info.playlist_id);
      video_form.append("creator_id", video_info.creator_id);
      video_form.append("tag_ids", video_info.tag_ids);

      if(video_info.file) {
            video_form.append("file", video_info.file);
      }
      return video_form;
}


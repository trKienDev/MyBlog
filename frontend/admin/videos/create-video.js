import api_configs from "../../api/api.config.js";
import { initSelectSearch } from "../../components/select-search.component.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { error_sweetAlert } from "../../utils/sweet-alert.js";
import { showToast } from "../../utils/toast-notification.js";
import { displaySelectedTag, getCodeByStudio, getSelectedCodeOption } from "../films/films.js";
import { getDateFromStr } from "../../utils/date.js";
import { CreateTdTextCell } from "../../components/table.component.js";
import { getStudioById } from "../../api/studio.api.js";
import css_selectors from "../../selectors/css.selectors.js";
import { film_api } from "../../api/film.api.js";

export function initCreateVideo() {
      initSearchFilm();
      searchFilm();
      initSelectSearch(id_selectors.videos.video_creator, api_configs.endpoints.getCreators, 'name');
      initSelectSearch(id_selectors.videos.video_tag, api_configs.endpoints.getTagsByVideo, 'name');
      initSelectSearch(id_selectors.videos.video_playlist, api_configs.endpoints.getPlaylists, 'name');
      displaySelectedTag(id_selectors.videos.video_tag, id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

      document.getElementById('thumbnail-video').addEventListener('click', function() {
            document.getElementById('upload-video').click();
      });
      
      document.getElementById('upload-video').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type === 'video/mp4') {
                  const videoElement = document.querySelector('video');
                  const sourceElement = videoElement.querySelector('source');
                  const thumbnailImage = document.getElementById('thumbnail-video');

                  const videoURL = URL.createObjectURL(file);

                  sourceElement.src = videoURL;

                  videoElement.load();

                  videoElement.classList.remove('d-none');
                  thumbnailImage.style.display = 'none';
            } else {
                  alert('Please upload a valid MP4 video.');
            }
      });
}

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

async function createFilmRow(film) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', film._id);

      tr.appendChild(CreateTdTextCell(film.name));

      const film_studio = await getStudioById(film.studio_id);
      tr.appendChild(CreateTdTextCell(film_studio.name));

      const formatted_date = getDateFromStr(new Date(film.date));
      tr.appendChild(CreateTdTextCell(formatted_date));

      tr.appendChild(CreateTdTextCell(film.rating));

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

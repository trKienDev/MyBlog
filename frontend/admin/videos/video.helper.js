import api_configs from "../../api/api.config.js";
import { film_api } from "../../api/film.api.js";
import { studio_api } from "../../api/studio.api.js";
import table_component from "../../components/table.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import date_utils from "../../utils/date.js";
import film_helper from "../films/film.helper.js";

async function renderFilmsTable(films, tbody) {
      tbody.innerHTML = '';

      for (const film of films) {
            let { tr, checkbox } = await createFilmTr(film);
            tr = bindFilmRowEvents(tr, checkbox, film);
            tbody.appendChild(tr);
      }

      return tbody;
}

async function createFilmTr(film) {
      const tr = document.createElement('tr');
      tr.setAttribute(id_selectors.films.film_id, film._id);
      tr.setAttribute(id_selectors.code.code_id, film.code_id);

      tr.appendChild(table_component.createTextTd({ i_text: film.name }));

      const film_studio = await studio_api.getStudioById(film.studio_id);
      tr.appendChild(table_component.createTextTd({ i_text: film_studio.name, i_id: film.studio_id }));

      const formatted_date = date_utils.getDateFromStr(new Date(film.date));
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
    
            loadThumbnailOfSelectedFIlm(film);
      });

      return tr;
}
function loadThumbnailOfSelectedFIlm(ifilm) {
      const thumbnail_element = document.getElementById(id_selectors.thumbnail.thumbnail_image);
      thumbnail_element.src = `${api_configs.server}/uploads/film/${ifilm.thumbnail}`;
      thumbnail_element.alt = `${ifilm.name} thumbnail`;

      return thumbnail_element;
}

async function createSearchFilmBtn(button_id) {
      let search_btn = document.getElementById(button_id);
      return handleSearchFilmBtn(search_btn);
}
async function handleSearchFilmBtn(search_btn) {
      search_btn.addEventListener('click', async () => {
            const studio = document.getElementById(id_selectors.films.film_studio),
            studio_id = studio.querySelector('span').getAttribute('item-id');
            if(!studio_id) {
                  showToast('Please select studio', 'warning');
            }
            const code_id = film_helper.getSelectedCodeOption(id_selectors.films.film_code).value;
            try {
                  const films = await film_api.getFilmsByStudioCode(studio_id, code_id);

                  const tbody = document.querySelector(`#${id_selectors.table.search_film} tbody`);
                  renderFilmsTable(films, tbody);
            } catch(error) {
                  error_sweetAlert(error);
            }
      });

      return search_btn;
}

function waitForUploadVideo(thumbnail_video, upload_video) {
      const thumbnail = document.getElementById(thumbnail_video);
      const upload_input = document.getElementById(upload_video);

      thumbnail.addEventListener('click', () => {
            upload_input.click();
      });

      upload_input.addEventListener('change', handleVideoUpload);
}

function handleVideoUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'video/mp4') {
            const video_element  = document.querySelector('video');
            const source_element = video_element.querySelector('source');

            const thumbnail_image = document.getElementById(id_selectors.videos.thumbnail_video);

            const video_url = URL.createObjectURL(file);
            source_element.src = video_url;
            video_element.load();
            video_element.classList.remove('d-none');
            thumbnail_image.style.display = 'none';
      } else {
            showToast('Please upload a valid mp4 video', 'error');
      }
}

const video_helpers = {
      renderFilmsTable,
      createFilmTr,
      createSearchFilmBtn,
      loadThumbnailOfSelectedFIlm,
      waitForUploadVideo,
      handleVideoUpload,
}
export default video_helpers;

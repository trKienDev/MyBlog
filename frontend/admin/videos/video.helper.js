import api_configs from "../../api/api.config.js";
import { film_api } from "../../api/film.api.js";
import { studio_api } from "../../api/studio.api.js";
import table_component from "../../components/table.component.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import date_utils from "../../utils/date.js";
import image_utils from "../../utils/image.utils.js";
import film_helper from "../films/film.helper.js";

async function renderFilmsTable(films, tbody) {
      tbody.innerHTML = '';

      for (const film of films) {
            let { tr, checkbox } = await createFilmTr(film);

            const onTrSelectedHandler = (selected_film) => {
                  image_utils.loadThumbnailOfSelectedFilm(selected_film, ServerFolders.FILMS);
            }

            tr = table_component.handleTrSelection(
                  id_selectors.table.search_film, 
                  tr, 
                  checkbox, 
                  film,
                  onTrSelectedHandler,
            );
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

      const { td: selectTd_element, checkbox: filmCheckbox_element } = table_component.createSelectCheckboxTd(css_selectors.films.film_select);
      tr.appendChild(selectTd_element);

      return { tr, checkbox: filmCheckbox_element };
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
      handleVideoUpload,
}
export default video_helpers;

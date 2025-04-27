import api_configs from "../../api/api.config.js";
import { initSelectSearch } from "../../components/select-search.component.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { error_sweetAlert } from "../../utils/sweet-alert.js";
import { showToast } from "../../utils/toast-notification.js";
import { getCodeByStudio, getSelectedCodeOption } from "../films/films.js";
import * as fetchAPI from "../../api/fetch.api.js";
import { getDateFromStr } from "../../utils/date.js";
import { CreateTdTextCell } from "../../components/table.component.js";
import { getStudioById } from "../../api/studio.api.js";

export function initCreateVideo() {
      initSearchFilm();
      searchFilm();
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
      const search_btn = document.getElementById('search-film');
      search_btn.addEventListener('click', async () => {
            const studio = document.getElementById('film-studio'),
            studio_id = studio.querySelector('span').getAttribute('item-id');
            if(!studio_id) {
                  showToast('Please select studio', 'warning');
            }
            const code_id = getSelectedCodeOption(id_selectors.films.film_code).value;

            const result = await fetchAPI.get(`${api_configs.endpoints.findFilmsByStudioCode}/${studio_id}/${code_id}`);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            const films = result.data;
            
            renderFilmTable(films);
      });
}

function renderFilmTable(films) {
      const tbody = document.querySelector('#searched-films_table tbody');
      tbody.innerHTML = '';
      films.forEach( async (film) => {
            console.log('film: ', film);
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', film._id);

            const name = CreateTdTextCell(film.name);
            tr.appendChild(name);

            const film_studio = await getStudioById(film.studio_id);
            const studio = CreateTdTextCell(film_studio.name);
            tr.appendChild(studio);

            const film_date = new Date(film.date);
            const formatted_date = getDateFromStr(film_date);
            const date = CreateTdTextCell(formatted_date);
            tr.appendChild(date);

            const rating = CreateTdTextCell(film.rating);
            tr.appendChild(rating);

            tbody.appendChild(tr);
      });
}


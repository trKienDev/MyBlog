import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import selectSearch_component from "../../../components/select-search.component.js";
import table_component from "../../../components/table.component.js";
import id_selectors from "../../../selectors/element-id.selector.js";
import { error_sweetAlert } from "../../../utils/sweet-alert.js";

export function initCreateAnimeVideo() {
      // initSearchAnimeFilm();
}

async function initSearchAnimeFilm() {
      try {
            selectSearch_component.initSelectSearch('search-anime_film', api_configs.endpoints.getAnimeFilms, 'name');
      } catch(error) {
            console.error('Error init search anime film');
            error_sweetAlert(error);
      }
}

async function renderAnimeFIlm() {
      const anime_films = await animes_api.getAnimeFilms();

      const tbody = document.querySelector(`#${id_selectors.table.anime_table} tbody`);
      tbody.innerHTML = '';

      anime_films.forEach(async(anime) => {
            const tr = table_component.createTrWithId(anime._id);

            const name = table_component.createTextTd({ i_text: anime.name });
            tr.appendChild(name);

            
      });

}
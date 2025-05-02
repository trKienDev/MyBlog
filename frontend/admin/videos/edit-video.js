import api_configs from "../../api/api.config.js";
import { film_api } from "../../api/film.api.js";
import { studio_api } from "../../api/studio.api.js";
import selectSearch_component from "../../components/select-search.component.js";
import select_component from "../../components/select.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { loadContentFromUrl } from "../../services/loadElement/load-dynamic-section.js";
import tags_utils from "../../utils/tags.utils.js";
import { showToast } from "../../utils/toast-notification.js";
import { getCodeByStudio } from "../films/films.js";
import video_helpers from "./video.helper.js";

const endpoint = api_configs.endpoints.adminEditVideoPage;

export function redirectToEditVideoPage(ivideo) {
      loadContentFromUrl(endpoint, () => initEditVideoAdmin(ivideo)); // truyền initEditVideoAdmin như là 1 hàm callback trong loadContentFromUrl 
}

async function initEditVideoAdmin(ivideo) {
      initSearchFilm(ivideo);  
      const search_btn = video_helpers.createSearchFilmBtn(id_selectors.films.search_film);
      selectSearch_component.initSelectSearch(id_selectors.videos.video_action, api_configs.endpoints.getTagsByAction, 'name');
      selectSearch_component.initSelectSearch(id_selectors.videos.video_creator, api_configs.endpoints.getCreators, 'name');
      selectSearch_component.initSelectSearch(id_selectors.videos.video_tag, api_configs.endpoints.getTagsByVideo, 'name');
      selectSearch_component.initSelectSearch(id_selectors.videos.video_playlist, api_configs.endpoints.getPlaylists, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.selected_tag, id_selectors.videos.video_tag);
      video_helpers.waitForUploadVideo(id_selectors.videos.thumbnail_video, id_selectors.videos.upload_video);

}

async function populateVideoForm() {
      await selectSearch_component.loadInfoSelectSearch(ivideo, id_selectors.films.film_studio, id_selectors.studio.studio_id, studio_api.getStudioNameById);
      await select_component.selectCodeByStudio(id_selectors.films.film_code, ivideo.studio_id);

      try {
            const film = await film_api.findFilmById(ivideo.film_id);
            renderFilmOfUpdatedVideo(film);
      } catch(error) {
            console.error('Error in renderFilmTable: ', error);
            showToast(error, 'error');
      }
}

// Search film
async function initSearchFilm(ivideo) {
      try {
            selectSearch_component.initSelectSearch(id_selectors.films.film_studio, api_configs.endpoints.getStudios, 'name');
            select_component.getCodeOptionByStudoId(id_selectors.films.film_code, ivideo.code_id);
            getCodeByStudio(id_selectors.films.film_studio);

      } catch(error) {
            console.error('Error initSearchFilm: ', error);
            showToast(error, 'error');
      }

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



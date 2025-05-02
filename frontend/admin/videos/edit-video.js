import api_configs from "../../api/api.config.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { loadContentFromUrl } from "../../services/loadElement/load-dynamic-section.js";
import { showToast } from "../../utils/toast-notification.js";

const endpoint = api_configs.endpoints.adminEditVideoPage;

export function redirectToEditVideoPage(ivideo) {
      loadContentFromUrl(endpoint, initEditVideoAdmin(ivideo));
}

function initEditVideoAdmin(ivideo) {
      // initSearchFilm();
      const film_studio = document.querySelectorAll('#edit-video');
      console.log('edit-video: ', film_studio);      
}


// Search film
async function initSearchFilm() {
      try {
            const element_id = document.querySelector(`#${id_selectors.films.film_studio}`);
            console.log('element id: ', element_id);
            // initSelectSearch(id_selectors.films.film_studio, api_configs.endpoints.getStudios, 'name');
            // getCodeByStudio(id_selectors.films.film_studio);
      } catch(error) {
            console.error('Error initSearchFilm: ', error);
            showToast(error, 'error');
      }
}
import { ResetModal, SetupModalHandlers } from "../../components/modal.component.js";
import { selectCodeByStudio, SelectFilmTags, SelectStudios } from "../../components/select.component.js";
import { InitSelectSearch } from "../../components/select-search.component.js";
import * as fetchAPI from "../../api/fetch.api.js";
import apiConfig from "../../api/api.config.js";

let modalId = "create-modal";
let filmStudio = 'film-studio';
let filmCode = 'film-code';
let filmTag = 'film-tag';
let filmCollection = 'film-collection';

export async function initFilmAdmin() {
      SetupModalHandlers("open-modal_button", "close-modal_button", modalId);
      InitSelectSearch(filmStudio, apiConfig.endpoints.getStudios, 'name');
      InitSelectSearch(filmTag, apiConfig.endpoints.getFilmTags, 'name');
      InitSelectSearch(filmCollection, apiConfig.endpoints.getCollections, 'name');
      getCodeByStudio();
}

function getCodeByStudio() {
      const optionsContainer = document.querySelector(`#${filmStudio} .content ul.options`);

      optionsContainer.addEventListener("click", (event) => {
            const li = event.target.closest("li");
            if(li && optionsContainer.contains(li)) {
                  const studio_id = li.getAttribute("value");
                  selectCodeByStudio(filmCode, studio_id);
            }
      });
}


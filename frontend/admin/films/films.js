import { ResetModal, SetupModalHandlers } from "../../components/modal.component.js";
import { selectCodeByStudio, SelectFilmTags, SelectStudios } from "../../components/select.component.js";
import { InitSelectSearch } from "../../components/select-search.component.js";
import * as fetchAPI from "../../api/fetch.api.js";
import apiConfig from "../../api/api.config.js";
import { waitForUploadOrSubmit } from "../../components/thumbnail.component.js";

let modalId = "create-modal";
let filmStudioId = 'film-studio';
let filmCodeId = 'film-code';
let filmTagId = 'film-tag';
let filmCollectionId = 'film-collection';
let thumbnailimgId = 'thumbnail-image';
let thumbnailUploadId = 'thumbnail-upload';
let submitBtnId = 'submit-btn';
let filmFormId = 'film-form';

export async function initFilmAdmin() {
      SetupModalHandlers("open-modal_button", "close-modal_button", modalId);
      InitSelectSearch(filmStudioId, apiConfig.endpoints.getStudios, 'name');
      InitSelectSearch(filmTagId, apiConfig.endpoints.getFilmTags, 'name');
      InitSelectSearch(filmCollectionId, apiConfig.endpoints.getCollections, 'name');
      getCodeByStudio();
      createNewFilm();
}

function getCodeByStudio() {
      const optionsContainer = document.querySelector(`#${filmStudioId} .content ul.options`);

      optionsContainer.addEventListener("click", (event) => {
            const li = event.target.closest("li");
            if(li && optionsContainer.contains(li)) {
                  const studio_id = li.getAttribute("value");
                  selectCodeByStudio(filmCodeId, studio_id);
            }
      });
}

async function createNewFilm() {
      
      while(true) {
            const result = await waitForUploadOrSubmit(thumbnailimgId, thumbnailUploadId, submitBtnId);
            if(result.type === 'upload') {
                  document.getElementById('thumbnail-image').src = URL.createObjectURL(result.file);
            } else if(result.type === 'submit') {
                  break;
            }
      }
      
      document.getElementById(filmFormId).addEventListener('submit', async function(event) {
            event.preventDefault();

            let formData = new FormData();
            const studioSelect = document.querySelector(`#${filmStudioId} .content ul.options`);
            studioSelect.addEventListener("click", (event) => {
                  const li = event.target.closest("li");
                  if(li && studioSelect.contains(li)) {
                        const studio_id = li.getAttribute("value");
                        selectCodeByStudio(filmCodeId, studio_id);
                        formData.append("studio", studio_id);
                  }
            });

            console.log("form data: ", formData);

      });
}


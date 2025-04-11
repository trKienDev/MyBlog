import { ResetModal, SetupModalHandlers } from "../../components/modal.component.js";
import { selectCodeByStudio, SelectFilmTags, SelectStudios } from "../../components/select.component.js";
import { getSelectedOptionId, InitSelectSearch, ResetSelectSearch } from "../../components/select-search.component.js";
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
let codeNumberId = 'code-number';
let selectedTagContaierId = 'selected-tag_container';
let selectedTagClass = 'selected-tag';
let defaultThumbnailImg = '/admin/static/images/film/thumbnail-upload_default.png';

export async function initFilmAdmin() {
      SetupModalHandlers("open-modal_button", "close-modal_button", modalId, ResetFilmModal);
      InitSelectSearch(filmStudioId, apiConfig.endpoints.getStudios, 'name');
      InitSelectSearch(filmTagId, apiConfig.endpoints.getFilmTags, 'name');
      InitSelectSearch(filmCollectionId, apiConfig.endpoints.getCollections, 'name');
      uploadThumbnail();
      getCodeByStudio();
      createNewFilm();
      displaySelectedTag(filmTagId, selectedTagContaierId, selectedTagClass);
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
      let formData = new FormData();
      
      document.getElementById(filmFormId).addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const studioId = getSelectedOptionId(filmStudioId);
            const codeId = getSelectedCodeOpt(filmCodeId).getAttribute("value");            
            const filmName = GetFilmName(filmCodeId, codeNumberId);
            const collectionId = getSelectedOptionId(filmCollectionId);

      });   
}

async function uploadThumbnail() {
      while(true) {
            const result = await waitForUploadOrSubmit(thumbnailimgId, thumbnailUploadId, submitBtnId);
            if(result.type === 'upload') {
                  document.getElementById('thumbnail-image').src = URL.createObjectURL(result.file);
            } else if(result.type === 'submit') {
                  break;
            }
      }
}

function getSelectedCodeOpt(filmCodeId) {
      let codeSelectionElement = document.getElementById(filmCodeId);
      const selectedCodeIndex = codeSelectionElement.selectedIndex;
      const selectedCodeOption = codeSelectionElement.options[selectedCodeIndex];
      return selectedCodeOption;
}

function GetFilmName(filmCodeId, codeNumbebId) {
      const codeNumber = document.getElementById(codeNumbebId).value;  
      const selectedCodeOption = getSelectedCodeOpt(filmCodeId);
      const selectedCodeText = selectedCodeOption.innerText;
      const filmName = selectedCodeText + "-" + codeNumber;
      return filmName;
}

async function displaySelectedTag(selectId, containerId, selectedTagClass) {
      const selectedTagContainer = document.getElementById(containerId);
      if(!selectedTagContainer) {
            console.error('selectedTagContainer not found!');
            return;
      } 

      selectedTagContainer.addEventListener('click', (event) => {
            if(event.target.classList.contains('selected-tag')) {
                  event.target.remove();
            }
      });

      observeSelectChange(selectId, ({ tagId, tagName}) => {
            const existTag = Array.from(selectedTagContainer.children).some(child => 
                  child.innerText === tagName || child.getAttribute('value') === tagId
            );
            if(!existTag) {
                  const newTagDiv = document.createElement("div");
                  newTagDiv.innerText = tagName;
                  newTagDiv.setAttribute('value', tagId);
                  newTagDiv.classList.add(selectedTagClass);
                  selectedTagContainer.appendChild(newTagDiv);
            }
      });
}

function observeSelectChange(selectId, callback) {
      const span = document.querySelector(`#${selectId} .select-btn span`);
      if(!span) {
            console.error('Span not found!');
            return;
      }

      const observer = new MutationObserver((mutationsList) => {
            for(const mutation of mutationsList) {
                  if (mutation.type === 'attributes' && mutation.attributeName === 'item-id') {
                        const tagId = span.getAttribute('item-id');
                        const tagName = span.textContent.trim();
                        if(tagId && tagName) {
                              callback({ tagId, tagName});
                        }
                  }
            }
      });

      observer.observe(span, {
            attributes: true,    
            childList: true,       
            characterData: true, 
            subtree: true     
      });

      return observer;
}

function ResetFilmModal() {
      ResetSelectSearch([
            { id: "film-studio", placeholder: "Select studio" },
            { id: "film-collection", placeholder: "Select collection" },
            { id: "film-tag", placeholder: "Select tag" }
      ]);
      ResetModal(filmFormId, thumbnailimgId, thumbnailUploadId, defaultThumbnailImg);
      ResetCodeSelection();
      ResetTagSelection();
}

function ResetCodeSelection() {
      const codeSelectEl = document.getElementById(filmCodeId);
      codeSelectEl.innerHTML = '';
      const option = document.createElement("option");
      option.innerText = 'Select code';
      codeSelectEl.appendChild(option);
}

function ResetTagSelection() {
      const tagContainer = document.getElementById(selectedTagContaierId);
      tagContainer.innerHTML = '';
}

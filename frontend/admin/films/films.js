import { CloseModal, openModal, ResetModal, SetupModalHandlers } from "../../components/modal.component.js";
import { selectCodeByStudio, SelectFilmTags, SelectStudios } from "../../components/select.component.js";
import { getSelectedOptionId, InitSelectSearch, ResetSelectSearch } from "../../components/select-search.component.js";
import * as fetchAPI from "../../api/fetch.api.js";
import apiConfig from "../../api/api.config.js";
import { waitForUploadOrSubmit } from "../../components/thumbnail.component.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweet-alert.js";
import { CreateEditButtonCell, CreateImageCell, CreateTdTextCell } from "../../components/table.component.js";
import { GetStudioById } from "../../api/studio.api.js";
import { GetDateFromStr } from "../../utils/date.js";
import { updateFilm } from "./update-film.js";

export let modalId = "create-modal";
export let filmStudio_id = 'film-studio';
export let filmCode_id = 'film-code';
let filmTagId = 'film-tag';
export let filmCollection_id = 'film-collection';
export let filmDate_id = 'release-date';
export let filmRating_id = 'film-rating';
let thumbnailimgId = 'thumbnail-image';
let thumbnailUploadId = 'thumbnail-upload';
let submitBtnId = 'submit-btn';
let filmFormId = 'film-form';
let codeNumberId = 'code-number';
let selectedTagContaierId = 'selected-tag_container';
let selectedTagClass = 'selected-tag';
let defaultThumbnailImg = '/admin/static/images/film/thumbnail-upload_default.png';
let closeModalBtnId= 'close-modal_button';
let filmTableBody = '#film-table tbody';
let openModalBtnId = 'open-modal_btn';

export async function initFilmAdmin() {
      SetupModalHandlers(openModalBtnId, closeModalBtnId, modalId, ResetFilmModal);
      RenderFilms(filmTableBody);
      InitSelectSearch(filmStudio_id, apiConfig.endpoints.getStudios, 'name');
      InitSelectSearch(filmTagId, apiConfig.endpoints.getFilmTags, 'name');
      InitSelectSearch(filmCollection_id, apiConfig.endpoints.getCollections, 'name');
      uploadThumbnail();
      getCodeByStudio();
      createNewFilm();
      displaySelectedTag(filmTagId, selectedTagContaierId, selectedTagClass);
}

async function RenderFilms(element) {
      try {
            const result = await fetchAPI.Get(apiConfig.endpoints.getFilms);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const films = result.data;
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            films.forEach(async (film) => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', film._id);

                  const editBtn = CreateEditButtonCell('edit-container', film, updateFilm);
                  tr.appendChild(editBtn);

                  const name = CreateTdTextCell(film.name);
                  tr.appendChild(name);

                  const filmStudio = await GetStudioById(film.studio_id);
                  const studio = CreateTdTextCell(filmStudio.name);
                  tr.appendChild(studio);

                  const filmDate = new Date(film.date);
                  const formattedDate = GetDateFromStr(filmDate);
                  const date = CreateTdTextCell(formattedDate);
                  tr.appendChild(date);

                  const rating = CreateTdTextCell(film.rating);
                  tr.appendChild(rating);

                  tbody.appendChild(tr);
            });
      } catch(error) {
            console.error('Error loading films: ', error);
            ErrorSweetAlert(error);
      }
}




async function createNewFilm() {  
      const submitBtn = document.getElementById(submitBtnId);
      document.getElementById(filmFormId).addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const studioId = getSelectedOptionId(filmStudio_id);
            const codeId = getSelectedCodeOpt(filmCode_id).getAttribute("value");            
            const filmName = GetFilmName(filmCode_id, codeNumberId);
            const collectionId = getSelectedOptionId(filmCollection_id);
            
            const thumbnailInput = document.getElementById("thumbnail-upload");
            const thumbnailFile = thumbnailInput.files[0];
            if(!thumbnailFile) {
                  alert("Please upload a thumbnail before submitting");
                  return;
            }

            const releaseDate = document.getElementById(filmDate_id).value;
            const rating = document.getElementById(filmRating_id).value;

            const selectedTagContainer = document.getElementById('selected-tag_container');
            const tagNodeList = selectedTagContainer.querySelectorAll('.selected-tag');
            const selectedTags = Array.from(tagNodeList).map(div => div.getAttribute('value'));

            const formData = new FormData();
            formData.append("studio_id", studioId);
            formData.append("code_id", codeId);
            formData.append("name", filmName);
            formData.append("collection_id", collectionId);
            formData.append("file", thumbnailFile);
            formData.append("date", releaseDate);
            formData.append("rating", rating);
            formData.append("tag_ids", selectedTags);
            console.log("film data: ", formData);

            try {
                  const result = await fetchAPI.CreateItem(apiConfig.endpoints.createFilm, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  SuccessSweetAlert("film created");
            } catch(error) {
                  console.error('Error creating film in client: ', error.message);
                  ErrorSweetAlert(error);
            } finally {
                  submitBtn.disabled = false;
                  ResetFilmModal();
            }
      });   
}

function getCodeByStudio() {
      const optionsContainer = document.querySelector(`#${filmStudio_id} .content ul.options`);

      optionsContainer.addEventListener("click", (event) => {
            const li = event.target.closest("li");
            if(li && optionsContainer.contains(li)) {
                  const studio_id = li.getAttribute("value");
                  selectCodeByStudio(filmCode_id, studio_id);
            }
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

export function getSelectedCodeOpt(filmCode_id) {
      let codeSelectionElement = document.getElementById(filmCode_id);
      const selectedCodeIndex = codeSelectionElement.selectedIndex;
      const selectedCodeOption = codeSelectionElement.options[selectedCodeIndex];
      return selectedCodeOption;
}

function GetFilmName(filmCode_id, codeNumbebId) {
      const codeNumber = document.getElementById(codeNumbebId).value;  
      const selectedCodeOption = getSelectedCodeOpt(filmCode_id);
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
      const codeSelectEl = document.getElementById(filmCode_id);
      codeSelectEl.innerHTML = '';
      const option = document.createElement("option");
      option.innerText = 'Select code';
      codeSelectEl.appendChild(option);
}

function ResetTagSelection() {
      const tagContainer = document.getElementById(selectedTagContaierId);
      tagContainer.innerHTML = '';
}


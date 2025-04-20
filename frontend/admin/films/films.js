import { CloseModal, open_modal, ResetModal, SetupModalHandlers } from "../../components/modal.component.js";
import { selectCodeByStudio, SelectFilmTags, SelectStudios } from "../../components/select.component.js";
import { get_selectedOption_byId, init_selectSearch, ResetSelectSearch } from "../../components/select-search.component.js";
import * as fetchAPI from "../../api/fetch.api.js";
import apiConfig from "../../api/api.config.js";
import { waitForUploadOrSubmit } from "../../components/thumbnail.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { create_editBtn, CreateImageCell, CreateTdTextCell } from "../../components/table.component.js";
import { GetStudioById } from "../../api/studio.api.js";
import { GetDateFromStr } from "../../utils/date.js";
import { update_film } from "./update-film.js";
import { create_film } from "./create-film.js";

export let modal_id = "create-modal";
export let filmStudio_id = 'film-studio';
export let filmCode_id = 'film-code';
export let filmTag_id = 'film-tag';
export let filmCollection_id = 'film-collection';
export let filmDate_id = 'release-date';
export let filmRating_id = 'film-rating';
export let thumbnail_ImgId = 'thumbnail-image';
export let thumbnailUpload_id = 'thumbnail-upload';
export let submitBtn_id = 'submit-btn';
export let filmForm_id = 'film-form';
export let codeNumber_id = 'code-number';
export let selectedTagContaier_id = 'selected-tag_container';
export let selectedTagClass = 'selected-tag';
let defaultThumbnailImg = '/admin/static/images/film/thumbnail-upload_default.png';
let closeModalBtnId= 'close-modal_button';
let filmTableBody = '#film-table tbody';
let openModalBtnId = 'open-modal_btn';
export let selectedTag_class = 'selected-tag';

export async function init_filmAdmin() {
      SetupModalHandlers(openModalBtnId, closeModalBtnId, modal_id, ResetFilmModal);
      render_films(filmTableBody);
      init_selectSearch(filmStudio_id, apiConfig.endpoints.getStudios, 'name');
      init_selectSearch(filmTag_id, apiConfig.endpoints.getFilmTags, 'name');
      init_selectSearch(filmCollection_id, apiConfig.endpoints.getCollections, 'name');
      uploadThumbnail();
      getCodeByStudio();
      create_film();
      displaySelectedTag(filmTag_id, selectedTagContaier_id, selectedTagClass);
}

async function render_films(element) {
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

                  const editBtn = await create_editBtn('edit-container', film, update_film);
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
            error_sweetAlert(error);
      }
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
            const result = await waitForUploadOrSubmit(thumbnail_ImgId, thumbnailUpload_id, submitBtn_id);
            if(result.type === 'upload') {
                  document.getElementById('thumbnail-image').src = URL.createObjectURL(result.file);
            } else if(result.type === 'submit') {
                  break;
            }
      }
}

export function get_selectedCode_option(filmCode_id) {
      let codeSelectionElement = document.getElementById(filmCode_id);
      const selectedCodeIndex = codeSelectionElement.selectedIndex;
      const selectedCodeOption = codeSelectionElement.options[selectedCodeIndex];
      return selectedCodeOption;
}

export function get_filmName(filmCode_id, codeNumbebId) {
      const codeNumber = document.getElementById(codeNumbebId).value;  
      const selectedCodeOption = get_selectedCode_option(filmCode_id);
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
                  const tag_div = create_tagDiv(tagId, tagName, selectedTagClass)
                  selectedTagContainer.appendChild(tag_div);
            }
      });
}

export function create_tagDiv(tag_id, tag_name, selected_tag_class) {
      const newTag_div = document.createElement("div");
      newTag_div.innerText = tag_name;
      newTag_div.setAttribute('value', tag_id);
      newTag_div.classList.add(selected_tag_class);
      return newTag_div;
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

export function ResetFilmModal() {
      ResetSelectSearch([
            { id: "film-studio", placeholder: "Select studio" },
            { id: "film-collection", placeholder: "Select collection" },
            { id: "film-tag", placeholder: "Select tag" }
      ]);
      ResetModal(filmForm_id, thumbnail_ImgId, thumbnailUpload_id, defaultThumbnailImg);
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
      const tagContainer = document.getElementById(selectedTagContaier_id);
      tagContainer.innerHTML = '';
}

export function get_selectedTags(container_id) {
      const tag_container = document.getElementById(container_id);
      const tag_nodes = tag_container.querySelectorAll(`.${selectedTag_class}`);
      return Array.from(tag_nodes).map(tag => tag.getAttribute('value'));
}

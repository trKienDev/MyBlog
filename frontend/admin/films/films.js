import modal_component from "../../components/modal.component.js";
import { getSelectedOptionById, initSelectSearch, resetSelectSearch } from "../../components/select-search.component.js";
import api_configs from "../../api/api.config.js";
import { waitForUploadOrSubmit } from "../../components/thumbnail.component.js";
import { error_sweetAlert } from "../../utils/sweet-alert.js";
import { create_editBtn, CreateTdTextCell } from "../../components/table.component.js";
import id_selectors from "../../selectors/element-id.selector.js";
import css_selectors from "../../selectors/css.selectors.js";
import { createFilm } from "./create-film.js";
import { updateFilm } from "./update-film.js";
import { selectCodeByStudio } from "../../components/select.component.js";
import { getStudioById } from "../../api/studio.api.js";
import { getDateFromStr } from "../../utils/date.js";
import fetch_api from "../../api/fetch.api.js";

let default_thumbnail = '/admin/static/images/film/thumbnail-upload_default.png';

const { resetModal, initModal } = modal_component;

export async function initFilmAdmin() {
      initModal(id_selectors.modal.open_button, id_selectors.modal.close_button, id_selectors.modal.create_film, resetFilmModal);
      renderFilms(id_selectors.table.film_tbody);
      initSelectSearch(id_selectors.films.film_studio, api_configs.endpoints.getStudios, 'name');
      initSelectSearch(id_selectors.films.film_tag, api_configs.endpoints.getFilmTags, 'name');
      initSelectSearch(id_selectors.films.film_collection, api_configs.endpoints.getCollections, 'name');
      uploadThumbnail(id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, id_selectors.buttons.submit_btn);
      getCodeByStudio(id_selectors.films.film_studio);
      displaySelectedTag(id_selectors.films.film_tag, id_selectors.container.selected_tag, css_selectors.tags.selected_tag);
      createFilm();
}

export async function renderFilms(element) {
      try {
            const result = await fetch_api.apiGet(api_configs.endpoints.getFilms);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const films = result.data;
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            films.forEach(async (film) => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', film._id);

                  const edit_btn = await create_editBtn('edit-container', film, updateFilm);
                  tr.appendChild(edit_btn);

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
      } catch(error) {
            console.error('Error loading films: ', error);
            error_sweetAlert(error);
      }
}

export function getCodeByStudio(studioEl_id){
      const options_container = document.querySelector(`#${studioEl_id} .content ul.options`);
      
      options_container.addEventListener("click", (event) => {
            const li = event.target.closest("li");
            if(li && options_container.contains(li)) {
                  const studio_id = li.getAttribute("value");
                  selectCodeByStudio(id_selectors.films.film_code, studio_id);
            }
      });
}

export async function uploadThumbnail(thumbnailImg_id, thumbnailUpload_id, submitBtn_id) {
      while(true) {
            const result = await waitForUploadOrSubmit(thumbnailImg_id, thumbnailUpload_id, submitBtn_id);
            if(result.type === 'upload') {
                  document.getElementById('thumbnail-image').src = URL.createObjectURL(result.file);
            } else if(result.type === 'submit') {
                  break;
            }
      }
}

export function getSelectedCodeOption(filmCode_id) {
      let codeSelection_element = document.getElementById(filmCode_id);
      const selectedCode_index = codeSelection_element.selectedIndex;
      const selectedCode_option = codeSelection_element.options[selectedCode_index];
      return selectedCode_option;
}

export function getFilmName(filmCode_id, codeNumbebId) {
      const code_number = document.getElementById(codeNumbebId).value;  
      const selectedCode_option = getSelectedCodeOption(filmCode_id);
      const selectedCode_text = selectedCode_option.innerText;
      const film_name = selectedCode_text + "-" + code_number;
      return film_name;
}

export async function displaySelectedTag(select_id, container_id, css_class) {
      const selectedTag_container = document.getElementById(container_id);
      if(!selectedTag_container) {
            console.error('selectedTag_container not found!');
            return;
      } 

      selectedTag_container.addEventListener('click', (event) => {
            if(event.target.classList.contains('selected-tag')) {
                  event.target.remove();
            }
      });

      observeSelectChange(select_id, ({ tag_id, tag_name}) => {
            const existTag = Array.from(selectedTag_container.children).some(child => 
                  child.innerText === tag_name || child.getAttribute('value') === tag_id
            );
            if(!existTag) {
                  const tag_div = createTagDiv(tag_id, tag_name, css_class)
                  selectedTag_container.appendChild(tag_div);
            }
      });
}

export function createTagDiv(tag_id, tag_name, css_class) {
      const newTag_div = document.createElement("div");
      newTag_div.innerText = tag_name;
      newTag_div.setAttribute('value', tag_id);
      newTag_div.classList.add(css_class);
      return newTag_div;
}

export function observeSelectChange(select_id, callback) {
      const span = document.querySelector(`#${select_id} .select-btn span`);
      if(!span) {
            console.error('Span not found!');
            return;
      }

      const observer = new MutationObserver((mutationsList) => {
            for(const mutation of mutationsList) {
                  if (mutation.type === 'attributes' && mutation.attributeName === 'item-id') {
                        const tag_id = span.getAttribute('item-id');
                        const tag_name = span.textContent.trim();
                        if(tag_id && tag_name) {
                              callback({ tag_id, tag_name});
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

export function resetFilmModal() {
      resetSelectSearch([
            { id: "film-studio", placeholder: "Select studio" },
            { id: "film-collection", placeholder: "Select collection" },
            { id: "film-tag", placeholder: "Select tag" }
      ]);
      resetModal(id_selectors.films.film_form, id_selectors.thumbnail.thumbnail_image,id_selectors.thumbnail.thumbnail_upload, default_thumbnail);
      resetCodeSelection(id_selectors.container.selected_tag);
      resetTagSelection();
}

function resetCodeSelection(filmCode_id) {
      const codeSelect_el = document.getElementById(filmCode_id);
      codeSelect_el.innerHTML = '';
      const option = document.createElement("option");
      option.innerText = 'Select code';
      codeSelect_el.appendChild(option);
}

function resetTagSelection() {
      const tag_container = document.getElementById(id_selectors.container.selected_tag);
      tag_container.innerHTML = '';
}

export function getSelectedTags(container_id, css_class) {
      const tag_container = document.getElementById(container_id);
      const tag_nodes = tag_container.querySelectorAll(`.${css_class}`);
      return Array.from(tag_nodes).map(tag => tag.getAttribute('value'));
}

export function buildFilmForm(include_file, thumbnail_file) {
      const form = new FormData();

      const studio_id = getSelectedOptionById(id_selectors.films.film_studio);
      const code_id = getSelectedCodeOption(id_selectors.films.film_code).value;
      const name = getFilmName(id_selectors.films.film_code, id_selectors.films.code_number);
      const collection_id = getSelectedOptionById(id_selectors.films.film_collection);
      const date = document.getElementById(id_selectors.date.release_date).value;
      const rating = document.getElementById(id_selectors.films.film_rating).value;
      const tags = getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

      form.append("studio_id", studio_id);
      form.append("code_id", code_id);
      form.append("name", name);
      form.append("collection_id", collection_id);
      form.append("date", date);
      form.append("rating", rating);
      form.append("tag_ids", tags);

      if(include_file && thumbnail_file) {
            form.append("file", thumbnail_file);
      }

      return form;
}

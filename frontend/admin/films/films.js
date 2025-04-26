import { open_modal, reset_modal, SetupModalHandlers } from "../../components/modal.component.js";
import { selectCode_byStudio, SelectFilmTags, SelectStudios } from "../../components/select.component.js";
import { get_selectedOption_byId, init_selectSearch, reset_selectSearch } from "../../components/select-search.component.js";
import * as fetchAPI from "../../api/fetch.api.js";
import apiConfig from "../../api/api.config.js";
import { waitForUploadOrSubmit } from "../../components/thumbnail.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { create_editBtn, CreateImageCell, CreateTdTextCell } from "../../components/table.component.js";
import { GetStudioById } from "../../api/studio.api.js";
import { GetDateFromStr } from "../../utils/date.js";
import { update_film } from "./update-film.js";
import { create_film } from "./create-film.js";
import { FILM_DATE_ID, FILM_RATING_ID, THUMBNAIL_IMG_ID, THUMBNAIL_UPLOAD_ID } from "./film-css.selector.js";
// import { FILM_TAG_ID, SUBMIT_BTN_ID } from "../../config/css-selector.js";
import css_selectors from "../../config/css-selector.js";


export let filmForm_id = 'film-form';
export let codeNumber_id = 'code-number';
export let selectedTag_contaienr_id = 'selected-tag_container';
let default_thumbnail = '/admin/static/images/film/thumbnail-upload_default.png';
let close_modalBtn_id = 'close-modal_button';
export let film_tableBody = '#film-table tbody';
let open_modalBtn_id = 'open-modal_btn';
export let selectedTag_class = 'selected-tag';

export async function init_filmAdmin() {
      SetupModalHandlers(open_modalBtn_id, close_modalBtn_id, css_selectors.CREATE_FILM_MODAL_ID, resetFilm_modal);
      render_films(film_tableBody);
      init_selectSearch(css_selectors.FILM_STUDIO_ID, apiConfig.endpoints.get_studios, 'name');
      init_selectSearch(css_selectors.FILM_TAG_ID, apiConfig.endpoints.getFilmTags, 'name');
      init_selectSearch(css_selectors.FILM_COLLECTION_ID, apiConfig.endpoints.getCollections, 'name');
      upload_thumbnail(THUMBNAIL_IMG_ID, THUMBNAIL_UPLOAD_ID, css_selectors.SUBMIT_BTN_ID);
      getCode_byStudio(css_selectors.FILM_STUDIO_ID);
      display_selectedTag(css_selectors.FILM_TAG_ID, selectedTag_contaienr_id, selectedTag_class);
      create_film();
}

export async function render_films(element) {
      try {
            const result = await fetchAPI.get(apiConfig.endpoints.getFilms);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const films = result.data;
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            films.forEach(async (film) => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', film._id);

                  const edit_btn = await create_editBtn('edit-container', film, update_film);
                  tr.appendChild(edit_btn);

                  const name = CreateTdTextCell(film.name);
                  tr.appendChild(name);

                  const film_studio = await GetStudioById(film.studio_id);
                  const studio = CreateTdTextCell(film_studio.name);
                  tr.appendChild(studio);

                  const film_date = new Date(film.date);
                  const formatted_date = GetDateFromStr(film_date);
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

export function getCode_byStudio(studioEl_id){
      const options_container = document.querySelector(`#${studioEl_id} .content ul.options`);

      options_container.addEventListener("click", (event) => {
            const li = event.target.closest("li");
            if(li && options_container.contains(li)) {
                  const studio_id = li.getAttribute("value");
                  selectCode_byStudio(css_selectors.FILM_CODE_ID, studio_id);
            }
      });
}

export async function upload_thumbnail(thumbnailImg_id, thumbnailUpload_id, submitBtn_id) {
      while(true) {
            const result = await waitForUploadOrSubmit(thumbnailImg_id, thumbnailUpload_id, submitBtn_id);
            if(result.type === 'upload') {
                  document.getElementById('thumbnail-image').src = URL.createObjectURL(result.file);
            } else if(result.type === 'submit') {
                  break;
            }
      }
}

export function get_selectedCode_option(filmCode_id) {
      let codeSelection_element = document.getElementById(filmCode_id);
      const selectedCode_index = codeSelection_element.selectedIndex;
      const selectedCode_option = codeSelection_element.options[selectedCode_index];
      return selectedCode_option;
}

export function get_filmName(filmCode_id, codeNumbebId) {
      const code_number = document.getElementById(codeNumbebId).value;  
      const selectedCode_option = get_selectedCode_option(filmCode_id);
      const selectedCode_text = selectedCode_option.innerText;
      const film_name = selectedCode_text + "-" + code_number;
      return film_name;
}

export async function display_selectedTag(select_id, container_id, selectedTag_class) {
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

      observe_selectChange(select_id, ({ tag_id, tag_name}) => {
            const existTag = Array.from(selectedTag_container.children).some(child => 
                  child.innerText === tag_name || child.getAttribute('value') === tag_id
            );
            if(!existTag) {
                  const tag_div = create_tagDiv(tag_id, tag_name, selectedTag_class)
                  selectedTag_container.appendChild(tag_div);
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

export function observe_selectChange(select_id, callback) {
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

export function resetFilm_modal() {
      reset_selectSearch([
            { id: "film-studio", placeholder: "Select studio" },
            { id: "film-collection", placeholder: "Select collection" },
            { id: "film-tag", placeholder: "Select tag" }
      ]);
      reset_modal(filmForm_id, THUMBNAIL_IMG_ID, THUMBNAIL_UPLOAD_ID, default_thumbnail);
      resetCode_selection(css_selectors.FILM_CODE_ID);
      resetTag_selection();
}

function resetCode_selection(filmCode_id) {
      const codeSelect_el = document.getElementById(filmCode_id);
      codeSelect_el.innerHTML = '';
      const option = document.createElement("option");
      option.innerText = 'Select code';
      codeSelect_el.appendChild(option);
}

function resetTag_selection() {
      const tag_container = document.getElementById(selectedTag_contaienr_id);
      tag_container.innerHTML = '';
}

export function get_selectedTags(container_id) {
      const tag_container = document.getElementById(container_id);
      const tag_nodes = tag_container.querySelectorAll(`.${selectedTag_class}`);
      return Array.from(tag_nodes).map(tag => tag.getAttribute('value'));
}

export function build_filmForm(include_file, thumbnail_file) {
      const form = new FormData();

      const studio_id = get_selectedOption_byId(css_selectors.FILM_STUDIO_ID);
      const code_id = get_selectedCode_option(css_selectors.FILM_CODE_ID).value;
      const name = get_filmName(css_selectors.FILM_CODE_ID, codeNumber_id);
      const collection_id = get_selectedOption_byId(css_selectors.FILM_COLLECTION_ID);
      const date = document.getElementById(FILM_DATE_ID).value;
      const rating = document.getElementById(FILM_RATING_ID).value;
      const tags = get_selectedTags(selectedTag_contaienr_id);

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

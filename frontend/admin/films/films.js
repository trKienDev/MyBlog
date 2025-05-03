import modal_component from "../../components/modal.component.js";
import selectSearch_component, { resetSelectSearch } from "../../components/select-search.component.js";
import api_configs from "../../api/api.config.js";
import { waitForUploadOrSubmit } from "../../components/thumbnail.component.js";
import { error_sweetAlert } from "../../utils/sweet-alert.js";
import table_component from "../../components/table.component.js";
import id_selectors from "../../selectors/element-id.selector.js";
import css_selectors from "../../selectors/css.selectors.js";
import { createFilm } from "./create-film.js";
import { updateFilm } from "./update-film.js";
import fetch_api from "../../api/fetch.api.js";
import { studio_api } from "../../api/studio.api.js";
import tags_utils from "../../utils/tags.utils.js";
import select_component from "../../components/select.component.js";
import film_helper from "./film.helper.js";
import date_utils from "../../utils/date.js";

let default_thumbnail = '/admin/static/images/film/thumbnail-upload_default.png';

export async function initFilmAdmin() {
      modal_component.initModal(id_selectors.modal.open_button, id_selectors.modal.close_button, id_selectors.modal.create_film, resetFilmModal);
      renderFilms(id_selectors.table.film_tbody);
      selectSearch_component.initSelectSearch(id_selectors.films.film_studio, api_configs.endpoints.getStudios, 'name');
      selectSearch_component.initSelectSearch(id_selectors.films.film_tag, api_configs.endpoints.getFilmTags, 'name');
      selectSearch_component.initSelectSearch(id_selectors.films.film_collection, api_configs.endpoints.getCollections, 'name');
      uploadThumbnail(id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, id_selectors.buttons.submit_btn);
      getCodeByStudio(id_selectors.films.film_studio);
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.films.film_tag);
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

                  const edit_btn = await table_component.createEditBtn(css_selectors.container.edit_container, film, updateFilm);
                  tr.appendChild(edit_btn);

                  const name = table_component.createTextTd({ i_text: film.name });
                  tr.appendChild(name);

                  const film_studio = await studio_api.getStudioById(film.studio_id);
                  const studio = table_component.createTextTd({ i_text: film_studio.name });
                  tr.appendChild(studio);

                  const film_date = new Date(film.date);
                  const formatted_date = date_utils.getDateFromStr(film_date);
                  const date = table_component.createTextTd({ i_text: formatted_date });
                  tr.appendChild(date);

                  const rating = table_component.createTextTd({ i_text: film.rating });
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
                  select_component.selectCodeByStudio(id_selectors.films.film_code, studio_id);
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

export function getFilmName(filmCode_id, codeNumbebId) {
      const code_number = document.getElementById(codeNumbebId).value;  
      const selectedCode_option = film_helper.getSelectedCodeOption(filmCode_id);
      const selectedCode_text = selectedCode_option.innerText;
      const film_name = selectedCode_text + "-" + code_number;
      return film_name;
}

export function resetFilmModal() {
      resetSelectSearch([
            { id: "film-studio", placeholder: "Select studio" },
            { id: "film-collection", placeholder: "Select collection" },
            { id: "film-tag", placeholder: "Select tag" }
      ]);
      modal_component.resetModal(id_selectors.films.film_form, id_selectors.thumbnail.thumbnail_image,id_selectors.thumbnail.thumbnail_upload, default_thumbnail);
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

export function resetTagSelection() {
      const tag_container = document.getElementById(id_selectors.container.selected_tag);
      tag_container.innerHTML = '';
}

export function buildFilmForm(include_file, thumbnail_file) {
      const form = new FormData();

      const studio_id = selectSearch_component.getSelectedOptionValue(id_selectors.films.film_studio, 'id');
      const code_id = film_helper.getSelectedCodeOption(id_selectors.films.film_code).value;
      const name = getFilmName(id_selectors.films.film_code, id_selectors.films.code_number);
      const collection_id = selectSearch_component.getSelectedOptionValue(id_selectors.films.film_collection, 'id');
      const date = document.getElementById(id_selectors.date.release_date).value;
      const rating = document.getElementById(id_selectors.films.film_rating).value;
      const tags = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

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

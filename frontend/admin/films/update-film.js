import api_configs from "../../api/api.config.js";
import { GetCollectionName_byId } from "../../api/collection.api.js";
import { GetStudioName_byId } from "../../api/studio.api.js";
import { clone_resetForm } from "../../components/form.component.js";
import modal_component from "../../components/modal.component.js";
import { initSelectSearch, loadInfoSelectSearch } from "../../components/select-search.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { buildFilmForm, createTagDiv, displaySelectedTag, getCodeByStudio, renderFilms, uploadThumbnail } from "./films.js";
import id_selectors from "../../selectors/element-id.selector.js";
import css_selectors from "../../selectors/css.selectors.js";
import { selectCodeByStudio } from "../../components/select.component.js";
import { getTagById } from "../../api/tag.api.js";
import fetch_api from "../../api/fetch.api.js";

const { openModal, closeModal} = modal_component;

export async function updateFilm(film) {
      try {                 
            const cloned_form = clone_resetForm(id_selectors.films.film_form);
            await populateFilmForm(film);
            initModalUI(film);
            displaySelectedTag(id_selectors.films.film_tag, id_selectors.container.selected_tag, css_selectors.tags.selected_tag);
            closeUpdateModal(id_selectors.modal.create_film);

            cloned_form.addEventListener('submit', async function(event) {
                  event.preventDefault();

                  const form_data = collectUpdateForm();
                  try {
                        const result = await fetch_api.updateForm(`${api_configs.endpoints.update_film}/${film._id}`, form_data);
                        if(result.success === false) {
                              throw new Error(result.error);
                        }
                        
                        success_sweetAlert('film updated');
                        closeModal(id_selectors.modal.create_film);
                        renderFilms(id_selectors.table.film_tbody);
                  } catch(error) {
                        console.error('Error of update_film in server: ', error);
                        error_sweetAlert(error);
                  } finally {
                        modal_component.changeTitle(id_selectors.modal.create_film, '#submit-btn', 'btn-update', 'btn-create', 'Create film');
                  }
            });
      } catch(error) {
            console.error('Error in update_film: ', error);
            error_sweetAlert(error);
      }
}

function closeUpdateModal(modal_id) {
      const modal_el = document.getElementById(modal_id),
      btn_close = modal_el.querySelector('.btn-close');
      
      btn_close.addEventListener('click', () => {
            modal_component.changeTitle(modal_id, '#submit-btn', 'btn-update', 'btn-create', 'Create film');
      });
}

function collectUpdateForm() {
      const thumbnail = document.getElementById(id_selectors.thumbnail.thumbnail_upload).files[0];
      return buildFilmForm(!!thumbnail, thumbnail);
}

function initModalUI(film) {
      initSelectSearch(id_selectors.films.film_studio, api_configs.endpoints.getStudios, 'name');
      initSelectSearch(id_selectors.films.film_collection, api_configs.endpoints.getCollections, 'name');
      initSelectSearch(id_selectors.films.film_tag, api_configs.endpoints.getFilmTags, 'name');
      openModal(id_selectors.modal.create_film);     
      modal_component.changeTitle(id_selectors.modal.create_film, '#submit-btn', 'btn-create', 'btn-update', `Update ${film.name}`);
      uploadThumbnail(id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, id_selectors.buttons.submit_btn);
      getCodeByStudio(id_selectors.films.film_studio);
}

async function populateFilmForm(film) {
      await loadInfoSelectSearch(film, id_selectors.films.film_studio, 'studio_id', GetStudioName_byId);
      await selectCodeByStudio(id_selectors.films.film_code, film.studio_id);
      await loadInfoSelectSearch(film, id_selectors.films.film_collection, 'collection_id', GetCollectionName_byId);

      const filmCode_selEl = document.getElementById(id_selectors.films.film_code);
      filmCode_selEl.value = film.code_id;
      const film_name = film.name;
      const film_numb = film_name.split('-')[1]; 
      const filmNumb_input = document.getElementById('code-number');
      filmNumb_input.value = film_numb;

      const date_input = document.getElementById(id_selectors.date.release_date);
      const film_date = new Date(film.date);
      const formatted_date = film_date.toISOString().split('T')[0];
      date_input.value = formatted_date;

      const film_rating = document.getElementById(id_selectors.films.film_rating);
      film_rating.value = film.rating;

      const selectTag_container = document.getElementById(id_selectors.container.selected_tag);

      film.tag_ids.forEach(async(tag_el) => {
            const tag = await getTagById(tag_el);
            const tag_div = createTagDiv(tag._id, tag.name, css_selectors.tags.selected_tag);
            selectTag_container.appendChild(tag_div);
      });
      
      const film_thumbnail = document.getElementById(id_selectors.thumbnail.thumbnail_image);
      film_thumbnail.src = `${api_configs.server}/uploads/film/${film.thumbnail}`;
} 
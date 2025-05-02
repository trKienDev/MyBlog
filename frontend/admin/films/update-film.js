import api_configs from "../../api/api.config.js";
import { clone_resetForm } from "../../components/form.component.js";
import modal_component from "../../components/modal.component.js";
import selectSearch_component from "../../components/select-search.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { buildFilmForm, getCodeByStudio, renderFilms, uploadThumbnail } from "./films.js";
import id_selectors from "../../selectors/element-id.selector.js";
import css_selectors from "../../selectors/css.selectors.js";
import fetch_api from "../../api/fetch.api.js";
import { studio_api } from "../../api/studio.api.js";
import tags_utils from "../../utils/tags.utils.js";
import div_component from "../../components/div.component.js";
import tag_api from "../../api/tag.api.js";
import collection_api from "../../api/collection.api.js";
import select_component from "../../components/select.component.js";

export async function updateFilm(film) {
      try {                 
            const cloned_form = clone_resetForm(id_selectors.films.film_form);
            await populateFilmForm(film);
            initModalUI(film);
            tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.films.film_tag);
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
                        modal_component.closeModal(id_selectors.modal.create_film);
                        renderFilms(id_selectors.table.film_tbody);
                  } catch(error) {
                        console.error('Error of update_film in server: ', error);
                        error_sweetAlert(error);
                  } finally {
                        modal_component.changeTitle(id_selectors.modal.create_film, '#submit-btn', 'btn-update', 'btn-primary', 'Create film');
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
            modal_component.changeTitle(modal_id, '#submit-btn', 'btn-update', 'btn-primary', 'Create film');
      });
}

function collectUpdateForm() {
      const thumbnail = document.getElementById(id_selectors.thumbnail.thumbnail_upload).files[0];
      return buildFilmForm(!!thumbnail, thumbnail);
}

function initModalUI(film) {
      selectSearch_component.initSelectSearch(id_selectors.films.film_studio, api_configs.endpoints.getStudios, 'name');
      selectSearch_component.initSelectSearch(id_selectors.films.film_collection, api_configs.endpoints.getCollections, 'name');
      selectSearch_component.initSelectSearch(id_selectors.films.film_tag, api_configs.endpoints.getFilmTags, 'name');
      modal_component.openModal(id_selectors.modal.create_film);     
      modal_component.changeTitle(id_selectors.modal.create_film, '#submit-btn', 'btn-primary', 'btn-update', `Update ${film.name}`);
      uploadThumbnail(id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, id_selectors.buttons.submit_btn);
      getCodeByStudio(id_selectors.films.film_studio);
}

async function populateFilmForm(film) {
      console.log('film: ', film);
      await selectSearch_component.loadInfoSelectSearch(film, id_selectors.films.film_studio, id_selectors.studio.studio_id, studio_api.getStudioNameById);
      await select_component.selectCodeByStudio(id_selectors.films.film_code, film.studio_id);
      await selectSearch_component.loadInfoSelectSearch(film, id_selectors.films.film_collection, id_selectors.collection.collection_id, collection_api.getCollectionName);
      
      select_component.getCodeOptionByStudoId(id_selectors.films.film_code, film.code_id);
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
            const tag = await tag_api.getTagById(tag_el);
            const tag_div = div_component.createDiv({ icss_class: css_selectors.tags.selected_tag,
                                                                                    idiv_id: tag._id, 
                                                                                    idiv_name: tag.name })
            selectTag_container.appendChild(tag_div);
      });
      
      const film_thumbnail = document.getElementById(id_selectors.thumbnail.thumbnail_image);
      film_thumbnail.src = `${api_configs.server}/uploads/film/${film.thumbnail}`;
} 
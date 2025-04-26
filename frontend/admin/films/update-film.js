import apiConfig from "../../api/api.config.js";
import * as fetchAPI from '../../api/fetch.api.js';
import { GetCollectionName_byId } from "../../api/collection.api.js";
import { GetStudioName_byId } from "../../api/studio.api.js";
import { get_TagById } from "../../api/tag.api.js";
import { clone_resetForm } from "../../components/form.component.js";
import { change_modalTitle, close_modal, open_modal } from "../../components/modal.component.js";
import { get_selectedOption_byId, init_selectSearch, loadInfo_selectSearch } from "../../components/select-search.component.js";
import { selectCode_byStudio } from "../../components/select.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { build_filmForm, codeNumber_id, create_tagDiv, display_selectedTag, film_tableBody, filmForm_id, get_filmName, get_selectedCode_option, get_selectedTags, getCode_byStudio, observe_selectChange, render_films, resetFilm_modal, selectedTag_class, selectedTag_contaienr_id, upload_thumbnail } from "./films.js";
import { FILM_COLLECTION_ID, FILM_DATE_ID, FILM_RATING_ID, THUMBNAIL_IMG_ID, THUMBNAIL_UPLOAD_ID } from "./film-css.selector.js";
import css_selectors from "../../config/css-selector.js";

export async function update_film(film) {
      try {                 
            const cloned_form = clone_resetForm(filmForm_id);
            await populate_filmForm(film);
            init_modalUI(film);
            display_selectedTag(css_selectors.FILM_TAG_ID, selectedTag_contaienr_id, selectedTag_class);
            close_updateModal(css_selectors.CREATE_FILM_MODAL_ID);

            cloned_form.addEventListener('submit', async function(event) {
                  event.preventDefault();

                  const form_data = collect_updateForm();
                  try {
                        const result = await fetchAPI.update_form(`${apiConfig.endpoints.update_film}/${film._id}`, form_data);
                        if(result.success === false) {
                              throw new Error(result.error);
                        }
                        success_sweetAlert('film updated');
                        close_modal(css_selectors.CREATE_FILM_MODAL_ID);
                        render_films(film_tableBody);
                  } catch(error) {
                        console.error('Error of update_film in server: ', error);
                        error_sweetAlert(error);
                  } finally {
                        change_modalTitle(css_selectors.CREATE_FILM_MODAL_ID, '#submit-btn', 'btn-update', 'btn-create', 'Create film');
                  }
            });
      } catch(error) {
            console.error('Error in update_film: ', error);
            error_sweetAlert(error);
      }
}

function close_updateModal(modal_id) {
      const modal_el = document.getElementById(modal_id),
      btn_close = modal_el.querySelector('.btn-close');
      btn_close.addEventListener('click', () => {
            change_modalTitle(modal_id, '#submit-btn', 'btn-update', 'btn-create', 'Create film');
      });
}

function collect_updateForm() {
      const thumbnail = document.getElementById(THUMBNAIL_UPLOAD_ID).files[0];
      return build_filmForm(!!thumbnail, thumbnail);
}

function init_modalUI(film) {
      init_selectSearch(css_selectors.FILM_STUDIO_ID, apiConfig.endpoints.get_studios, 'name');
      init_selectSearch(FILM_COLLECTION_ID, apiConfig.endpoints.getCollections, 'name');
      init_selectSearch(css_selectors.FILM_TAG_ID, apiConfig.endpoints.getFilmTags, 'name');
      open_modal(css_selectors.CREATE_FILM_MODAL_ID);     
      change_modalTitle(css_selectors.CREATE_FILM_MODAL_ID, '#submit-btn', 'btn-create', 'btn-update', `Update ${film.name}`);
      upload_thumbnail(THUMBNAIL_IMG_ID, THUMBNAIL_UPLOAD_ID, css_selectors.SUBMIT_BTN_ID);
      getCode_byStudio(css_selectors.FILM_STUDIO_ID);
}

async function populate_filmForm(film) {
      await loadInfo_selectSearch(film, css_selectors.FILM_STUDIO_ID, 'studio_id', GetStudioName_byId);
      await selectCode_byStudio(css_selectors.FILM_CODE_ID, film.studio_id);
      await loadInfo_selectSearch(film, FILM_COLLECTION_ID, 'collection_id', GetCollectionName_byId);

      const filmCode_selEl = document.getElementById(css_selectors.FILM_CODE_ID);
      filmCode_selEl.value = film.code_id;
      const film_name = film.name;
      const film_numb = film_name.split('-')[1]; 
      const filmNumb_input = document.getElementById('code-number');
      filmNumb_input.value = film_numb;

      const date_input = document.getElementById(FILM_DATE_ID);
      const film_date = new Date(film.date);
      const formatted_date = film_date.toISOString().split('T')[0];
      date_input.value = formatted_date;

      const film_rating = document.getElementById(FILM_RATING_ID);
      film_rating.value = film.rating;

      const selectTag_container = document.getElementById(selectedTag_contaienr_id);

      film.tag_ids.forEach(async(tag_el) => {
            const tag = await get_TagById(tag_el);
            const tag_div = create_tagDiv(tag._id, tag.name, selectedTag_class);
            selectTag_container.appendChild(tag_div);
      });
      
      const film_thumbnail = document.getElementById(THUMBNAIL_IMG_ID);
      film_thumbnail.src = `${apiConfig.server}/uploads/film/${film.thumbnail}`;
} 
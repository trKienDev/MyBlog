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
import { build_filmForm, codeNumber_id, create_tagDiv, display_selectedTag, film_tableBody, filmCode_id, filmCollection_id, filmDate_id, filmForm_id, filmRating_id, filmStudio_id, filmTag_id, get_filmName, get_selectedCode_option, get_selectedTags, getCode_byStudio, modal_id, observe_selectChange, render_films, resetFilm_modal, selectedTag_class, selectedTag_contaienr_id, submitBtn_id, thumbnailImg_id, thumbnailUpload_id, upload_thumbnail } from "./films.js";

export async function update_film(film) {
      try {                 
            const cloned_form = clone_resetForm(filmForm_id);
            await populate_filmForm(film);
            init_modalUI(film);
            display_selectedTag(filmTag_id, selectedTag_contaienr_id, selectedTag_class);
            close_updateModal(modal_id);

            cloned_form.addEventListener('submit', async function(event) {
                  event.preventDefault();

                  const form_data = collect_updateForm();
                  try {
                        const result = await fetchAPI.update_form(`${apiConfig.endpoints.update_film}/${film._id}`, form_data);
                        if(result.success === false) {
                              throw new Error(result.error);
                        }
                        success_sweetAlert('film updated');
                        close_modal(modal_id);
                        render_films(film_tableBody);
                  } catch(error) {
                        console.error('Error of update_film in server: ', error);
                        error_sweetAlert(error);
                  } finally {
                        change_modalTitle(modal_id, '#submit-btn', 'btn-update', 'btn-create', 'Create film');
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
      const thumbnail = document.getElementById(thumbnailUpload_id).files[0];
      return build_filmForm(!!thumbnail, thumbnail);
}

function init_modalUI(film) {
      init_selectSearch(filmStudio_id, apiConfig.endpoints.getStudios, 'name');
      init_selectSearch(filmCollection_id, apiConfig.endpoints.getCollections, 'name');
      init_selectSearch(filmTag_id, apiConfig.endpoints.getFilmTags, 'name');
      open_modal(modal_id);     
      change_modalTitle(modal_id, '#submit-btn', 'btn-create', 'btn-update', `Update ${film.name}`);
      upload_thumbnail(thumbnailImg_id, thumbnailUpload_id, submitBtn_id);
      getCode_byStudio(filmStudio_id);
}

async function populate_filmForm(film) {
      await loadInfo_selectSearch(film, filmStudio_id, 'studio_id', GetStudioName_byId);
      await selectCode_byStudio(filmCode_id, film.studio_id);
      await loadInfo_selectSearch(film, filmCollection_id, 'collection_id', GetCollectionName_byId);

      const filmCode_selEl = document.getElementById(filmCode_id);
      filmCode_selEl.value = film.code_id;
      const film_name = film.name;
      const film_numb = film_name.split('-')[1]; 
      const filmNumb_input = document.getElementById('code-number');
      filmNumb_input.value = film_numb;

      const date_input = document.getElementById(filmDate_id);
      const film_date = new Date(film.date);
      const formatted_date = film_date.toISOString().split('T')[0];
      date_input.value = formatted_date;

      const film_rating = document.getElementById(filmRating_id);
      film_rating.value = film.rating;

      const selectTag_container = document.getElementById(selectedTag_contaienr_id);

      film.tag_ids.forEach(async(tag_el) => {
            const tag = await get_TagById(tag_el);
            const tag_div = create_tagDiv(tag._id, tag.name, selectedTag_class);
            selectTag_container.appendChild(tag_div);
      });
      
      const film_thumbnail = document.getElementById(thumbnailImg_id);
      film_thumbnail.src = `${apiConfig.server}/uploads/film/${film.thumbnail}`;
} 
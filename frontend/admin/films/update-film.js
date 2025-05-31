import api_configs from "../../api/api.config.js";
import { cloneResetForm } from "../../components/form.component.js";
import modal_component from "../../components/modal.component.js";
import selectSearch_component from "../../components/select-search.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { buildFilmForm, getCodeByStudio, getFilmName, renderFilms, resetFilmModal } from "./films.js";
import id_selectors from "../../selectors/element-id.selector.js";
import css_selectors from "../../selectors/css.selectors.js";
import fetch_api from "../../api/fetch.api.js";
import { studio_api } from "../../api/studio.api.js";
import tags_utils from "../../utils/tags.utils.js";
import collection_api from "../../api/collection.api.js";
import select_component from "../../components/select.component.js";
import film_helper from "./film.helper.js";
import tag_api from "../../api/tag.api.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import thumbnail_component from "../../components/thumbnail.component.js";
import dom_id from "../../constants/doms.constant.js";
import css_class from "../../constants/css.constant.js";
import { api_admin } from "../../api/endpoint.api.js";

export async function updateFilm(film) {
      try {                 
            const cloned_form = cloneResetForm(id_selectors.films.film_form);
            await populateFilmForm(film);
            initModalUI(film);

            tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.films.film_tag);
            closeUpdateModal(id_selectors.modal.create_film);

            cloned_form.addEventListener('submit', async function(event) {
                  event.preventDefault();
                  const changes  = collectUpdateForm();
                  const updated_fields = getUpdatedFilmFields(film, changes);
                  const updateFilm_form = buildUpdateFilmForm(updated_fields);

                  try {
                        console.log('update film: ', updateFilm_form);
                        const result = await fetch_api.updateForm(`${api_configs.endpoints.updateFilm}/${film._id}`, updateFilm_form);
                        if(result.success === false) {
                              throw new Error(result.error);
                        }
                        
                        success_sweetAlert('film updated');
                        resetFilmModal();
                        renderFilms(id_selectors.table.film_tbody);
                  } catch(error) {
                        console.error('Error of updateFilm in server: ', error);
                        error_sweetAlert(error);
                  } finally {
                        modal_component.closeModal(id_selectors.modal.create_film);
                        modal_component.changeTitle(id_selectors.modal.create_film, '#submit-btn', 'btn-update', css_selectors.button.primary_btn, 'Create film');
                  }
            });
      } catch(error) {
            console.error('Error in updateFilm: ', error);
            error_sweetAlert(error);
      }
}

function closeUpdateModal(modal_id) {
      const modal_el = document.getElementById(modal_id),
      btn_close = modal_el.querySelector('.btn-close');
      
      btn_close.addEventListener('click', () => {
            modal_component.changeTitle(modal_id, '#submit-btn', 'btn-update', css_selectors.button.primary_btn, 'Create film');
      });
}

function collectUpdateForm() {
      const studio_id = selectSearch_component.getSelectedOptionValue(dom_id.FILM_STUDIO, 'id');
      const code_id = film_helper.getSelectedCodeOption(dom_id.FILM_CODE).value;
      const name = getFilmName(dom_id.FILM_CODE, dom_id.CODE_NUMBER);
      const collection_id = selectSearch_component.getSelectedOptionValue(dom_id.FILM_COLLECTION, 'id');
      const date = document.getElementById(dom_id.RELEASE_DATE).value;
      const rating = document.getElementById(dom_id.FILM_RATING).value;
      const tags = tags_utils.getSelectedTags(dom_id.SELECTED_TAG_CONTAINER, css_class.SELECTED_TAG);
      const thumbnail = document.getElementById(dom_id.THUMBNAIL_UPLOAD).files[0];
      
      return { name, studio_id, code_id, collection_id, date, rating, tags, thumbnail };
}

/**
 * So sánh film gốc và filmInfo (dữ liệu form), trả về object chỉ chứa các field đã thay đổi.
 * @param {Object} film       – dữ liệu film ban đầu (ví dụ lấy từ API)
 * @param {Object} filmInfo   – dữ liệu film sau khi người dùng edit (keys có thể là strings, File…)
 * @returns {Object}          – Object gồm các trường cần gửi lên server để cập nhật
 */
function getUpdatedFilmFields(film, updated_fields) {
      const changes = {};
      changes.name = updated_fields.name;

      ['studio_id', 'code_id', 'collection_id'].forEach(field => {
            if (updated_fields[field] != null && updated_fields[field] !== film[field] ) 
                  changes[field] = updated_fields[field];
      });

      if (updated_fields.date) {
            const old_date = new Date(film.date).toISOString().slice(0, 10);
            if (updated_fields.date !== old_date) 
                  changes.date = updated_fields.date; 
      }

      if (updated_fields.rating != null) {
            const old_rating = String(film.rating);
            const new_rating = String(updated_fields.rating);
            if (new_rating !== old_rating) 
                  changes.rating = updated_fields.rating;
      }

      if (Array.isArray(updated_fields.tags)) {
            const new_tags = updated_fields.tags;
            const old_tags = Array.isArray(film.tag_ids) ? film.tag_ids : [];
            let differences = false;

            if (new_tags.length !== old_tags.length) {
                  differences = true;
            } else {
                  for (let i = 0; i < new_tags.length; i++) {
                        if (new_tags[i] !== old_tags[i]) {
                              differences = true;
                              break;
                        }
                  }
            }

            if (differences) 
                  changes.tag_ids = new_tags;
      }

      if (updated_fields.thumbnail instanceof File) 
            changes.thumbnail = updated_fields.thumbnail;

      return changes;
}
function buildUpdateFilmForm(updated_fields) {
      const form = new FormData();
      form.append("name", updated_fields.name);
      if(updated_fields.studio_id) form.append("studio_id", updated_fields.studio_id);
      if(updated_fields.code_id) form.append("code_id", updated_fields.code_id);
      if(updated_fields.collection_id) form.append("collection_id", updated_fields.collection_id);
      if(updated_fields.date) form.append("date", updated_fields.date);
      if(updated_fields.rating) form.append("rating", updated_fields.rating);
      if(updated_fields.tag_ids) form.append("tag_ids", updated_fields.tag_ids);
      if(updated_fields.thumbnail) form.append("file", updated_fields.thumbnail);

      return form
}

function initModalUI(film) {
      modal_component.openModal(dom_id.CREATE_FILM_MODAL);     
      modal_component.changeTitle(dom_id.CREATE_FILM_MODAL, `#${css_class.SUBMIT_BTN}`, css_class.LIGHT_BTN, css_class.BTN_UPDATE, `Update ${film.name}`);
      selectSearch_component.initSelectSearch(dom_id.FILM_STUDIO, api_admin.getStudios, 'name');
      selectSearch_component.initSelectSearch(dom_id.FILM_COLLECTION, api_admin.getCollections, 'name');
      selectSearch_component.initSelectSearch(dom_id.FILM_TAG, api_admin.getTagsByFilm, 'name');
      thumbnail_component.uploadThumbnail(dom_id.THUMBNAIL_IMAGE, dom_id.THUMBNAIL_UPLOAD, dom_id.SUBMIT_BTN);
      getCodeByStudio(dom_id.FILM_STUDIO);
}

async function populateFilmForm(film) {
      await selectSearch_component.loadInfoSelectSearch(film, dom_id.FILM_STUDIO, 'studio_id', studio_api.getStudioNameById);
      await select_component.selectCodeByStudio(dom_id.FILM_CODE, film.studio_id);
      if(film.collection_id) {
            await selectSearch_component.loadInfoSelectSearch(film, dom_id.FILM_COLLECTION, 'collection_id', collection_api.getCollectionName);
      }
      
      select_component.getCodeOptionByStudoId(dom_id.FILM_CODE, film.code_id);
      const film_name = film.name;
      const film_numb = film_name.split('-')[1]; 
      const filmNumb_input = document.getElementById('code-number');
      filmNumb_input.value = film_numb;

      const date_input = document.getElementById(dom_id.RELEASE_DATE);
      const film_date = new Date(film.date);
      const formatted_date = film_date.toISOString().split('T')[0];
      date_input.value = formatted_date;

      const film_rating = document.getElementById(dom_id.FILM_RATING);
      film_rating.value = film.rating;

      const selectTag_container = document.getElementById(dom_id.SELECTED_TAG_CONTAINER);
      selectTag_container.innerHTML = '';
      await tags_utils.renderSelectedTags(film.tag_ids, selectTag_container, tag_api.getTagById);
      
      const film_thumbnail = document.getElementById(dom_id.THUMBNAIL_IMAGE);
      film_thumbnail.src = `${api_configs.server}/${ServerFolders.FILMS}/${film.thumbnail}`;
} 


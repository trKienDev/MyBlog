import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import { api_user } from "../../../api/endpoint.api.js";
import fetch_api from "../../../api/fetch.api.js";
import { cloneResetForm } from "../../../components/form.component.js";
import modal_component from "../../../components/modal.component.js";
import selectSearch_component from "../../../components/select-search.component.js";
import table_component from "../../../components/table.component.js";
import thumbnail_component from "../../../components/thumbnail.component.js";
import css_selectors from "../../../selectors/css.selectors.js";
import id_selectors from "../../../selectors/element-id.selector.js";
import file_utils from "../../../utils/file.utils.js";
import string_utils from "../../../utils/string.utils.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";
import tags_utils from "../../../utils/tags.utils.js";
import { showToast } from "../../../utils/toast-notification.js";

let default_thumbnail = "/admin/static/images/film/thumbnail-upload_default.png";

export async function initAnimeFilm() {
      const anime_tags = await animes_api.getAnimeTags();
      console.log('anime tags: ', anime_tags);
      modal_component.initModal(id_selectors.modal.open_button, id_selectors.modal.close_button, id_selectors.modal.create_anime_film, resetAnimeModal);
      selectSearch_component.initSelectSearch(id_selectors.anime.film_studio, api_configs.endpoints.getAnimeStudios, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.film_series, api_configs.endpoints.getAnimeSeries, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.film_tag, api_user.getTagsByAnime, 'name');
      thumbnail_component.uploadThumbnail(id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, id_selectors.buttons.submit_btn);
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, 'anime-film_tag');
      renderAnimeFilms();
      createAnimeFilm();

}     

async function renderAnimeFilms() {
      const anime_films = await animes_api.getAnimeFilms();

      const tbody = document.querySelector(`#${id_selectors.table.anime_films} tbody`);
      tbody.innerHTML = '';

      anime_films.forEach(async (film) => {
            const tr = table_component.createTrWithId(film._id);

            const edit_btn = await table_component.createEditBtn(css_selectors.container.edit_container, film, updateAnimeFilm);
            tr.appendChild(edit_btn);

            const name = table_component.createTextTd({ i_text: film.name });
            tr.appendChild(name);

            const anime_studio = await animes_api.getAnimeStudioById(film.studio_id);
            const studio = table_component.createTextTd({ i_text: anime_studio.name });
            tr.appendChild(studio);

            if(film.series_id) {
                  console.log('film.series_id', film.series_id);
                  const anime_series = await animes_api.getAnimeSeriesById(film.series_id);
                  const series = table_component.createTextTd({ i_text: anime_series.name });
                  tr.appendChild(series);
            }
            else {
                  const series = table_component.createTextTd({ i_text: '' });
                  tr.appendChild(series);
            }

           

            const year = table_component.createTextTd({ i_text: film.year });
            tr.appendChild(year);

            const rating = table_component.createTextTd({ i_text: film.rating });
            tr.appendChild(rating);

            tbody.appendChild(tr);
      });
}

async function createAnimeFilm() {
      try {
            const animeFilm_form = document.getElementById(id_selectors.anime.film_form);
            animeFilm_form.addEventListener('submit', async(event) => {
                  event.preventDefault();
                  const submit_btn = document.getElementById(id_selectors.buttons.submit_btn);
                  submit_btn.disabled = true;

                  const form = buildFormData();
                  if(!form) {
                        submit_btn.disabled = false;
                        console.error('cannot find anime-film_form element');
                        showToast('error initializing anime film form', 'error');
                        return;
                  }

                  try { 
                        const result = await fetch_api.createForm(api_configs.endpoints.createAnimeFilm, form);
                        if(result.success === false) throw new Error(result.error);
                        
                        success_sweetAlert('Anime film created successfully');
                        renderAnimeFilms();
                  } catch(error) {
                        console.error('Error creating anime film: ', error.message);
                        error_sweetAlert(error);
                  } finally {
                        submit_btn.disabled = false;
                        modal_component.closeModal(id_selectors.modal.create_anime_film);
                        resetAnimeModal();
                  }
            });
      } catch(error) {
            console.error('Error initializing createAnimeFilm function: ', error);
            error_sweetAlert(error);
      }
}

async function updateAnimeFilm(anime) {
      try {
            const cloned_form = cloneResetForm(id_selectors.anime.film_form,);
            await populateAnimeFilmForm(anime);
            initModalUI(anime);

            tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.anime.film_tag);

            cloned_form.addEventListener('submit', async function(event) {
                  event.preventDefault();
                  const changes = collectUpdateAnimeForm();
                  const updated_fields = getUpdatedAnimeFields(anime, changes);
                  const updatedAnime_form = buildUpdateAnimeForm(updated_fields);

                  try {
                        const result = await fetch_api.updateForm(`${api_configs.endpoints.updateAnimeFilm}/${anime._id}`, updatedAnime_form);
                        if(result.success === false) {
                              throw new Error(result.error);
                        }

                        success_sweetAlert('anime film updated');
                        modal_component.closeModal(id_selectors.modal.create_anime_film);
                        renderAnimeFilms();
                  } catch(error) {
                        console.error('Error of updateAnimeFilm in server: ', error);
                        error_sweetAlert(error);
                  } finally {
                        modal_component.changeTitle(id_selectors.modal.create_anime_film, '#submit-btn', 'btn-update', css_selectors.button.primary_btn, "Create anime film");
                        resetAnimeModal();
                  }
            });
      } catch(error) {
            console.error('Error update anime film: ', error);
            showToast(error, 'error');
      }
}

function buildFormData() {
      const form = new FormData();

      const thumbnail = document.getElementById(id_selectors.thumbnail.thumbnail_upload).files[0];
      if(!thumbnail) {
            alert('Please upload a thumbnail before submitting');
            return null;
      }

      const name = document.getElementById(id_selectors.anime.film_name).value;
      const studio_id = selectSearch_component.getSelectedOptionValue(id_selectors.anime.film_studio, 'id');
      const series_id = selectSearch_component.getSelectedOptionValue(id_selectors.anime.film_series, 'id');
      const year = document.getElementById(id_selectors.anime.film_year).value;
      const rating = document.getElementById(id_selectors.anime.film_rating).value;
      const tags = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

      const identify_name = string_utils.RemoveAccents(name);
      const renamed_thumbnail = file_utils.renameUploadedFile(thumbnail, identify_name);

      form.append('name', name);
      form.append('studio_id', studio_id);
      if(series_id) form.append('series_id', series_id);
      form.append('year', year);
      form.append('rating', rating);
      form.append('tag_ids', tags);
      form.append('file', renamed_thumbnail);

      return form;
}

function initModalUI(anime) {
      modal_component.openModal(id_selectors.modal.create_anime_film);
      modal_component.changeTitle(id_selectors.modal.create_anime_film, '#submit-btn', css_selectors.button.primary_btn, 'btn-update', `Update ${anime.name}`);
      selectSearch_component.initSelectSearch(id_selectors.anime.film_studio, api_configs.endpoints.getAnimeStudios, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.film_series, api_configs.endpoints.getAnimeSeries, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.film_tag, api_configs.endpoints.getAnimeTagsByFilm, 'name');
      thumbnail_component.uploadThumbnail(id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, id_selectors.buttons.submit_btn);
}

// Update
async function populateAnimeFilmForm(anime) {
      const anime_name = document.getElementById('anime-film_name');
      anime_name.value = anime.name;
      
      await selectSearch_component.loadInfoSelectSearch(anime, id_selectors.anime.film_studio, 'studio_id', animes_api.getAnimeStudioNameById);
      if(anime.series_id) {
            await selectSearch_component.loadInfoSelectSearch(anime, id_selectors.anime.film_series, 'series_id', animes_api.getAnimeSeriesNameById);
      }
      const anime_year = document.getElementById('anime-film_year');
      anime_year.value = anime.year;

      const anime_rating = document.getElementById('anime-film_rating');
      anime_rating.value = anime.rating;

      const selectTag_container = document.getElementById(id_selectors.container.selected_tag);
      selectTag_container.innerHTML = '';
      await tags_utils.renderSelectedTags(anime.tag_ids, selectTag_container, animes_api.getAnimeTagById);

      const anime_thumbnail = document.getElementById(id_selectors.thumbnail.thumbnail_image);
      anime_thumbnail.src = `${api_configs.server}/uploads/anime/films/${anime.thumbnail}`;
}
function collectUpdateAnimeForm() {
      const name = document.getElementById(id_selectors.anime.film_name).value;
      const studio_id = selectSearch_component.getSelectedOptionValue(id_selectors.anime.film_studio, 'id');
      const series_id = selectSearch_component.getSelectedOptionValue(id_selectors.anime.film_series, 'id');
      const year = document.getElementById(id_selectors.anime.film_year).value;
      const rating = document.getElementById(id_selectors.anime.film_rating).value;
      const tags = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);
      const thumbnail = document.getElementById(id_selectors.thumbnail.thumbnail_upload).files[0];

      return { name, studio_id, series_id, year, rating, tags, thumbnail }; 
}
function getUpdatedAnimeFields(anime, updated_fields) {
      const changes = {};
      console.log('update fields: ', updated_fields);
      changes.name = updated_fields.name;

      ['studio_id', 'series_id'].forEach(field => {
            if(updated_fields[field] != null && updated_fields[field] !== anime[field]) 
                  changes[field] = updated_fields[field];
      });

      if(updated_fields.year) {
            const old_year = anime.year;
            if(updated_fields.year !== old_year) 
                  changes.year = updated_fields.year;
      }

      if(updated_fields.rating != null) {
            const old_rating = String(anime.rating);
            const new_rating = String(updated_fields.rating);
            console.log('old rating: ', old_rating);
            console.log('new rating: ', new_rating);
            if(new_rating !== old_rating) 
                  changes.rating = updated_fields.rating;
      }

      if(Array.isArray(updated_fields.tags)) {
            const new_tags = updated_fields.tags;
            const old_tags = Array.isArray(anime.tag_ids) ? anime.tag_ids : [];
            let differences = false;

            if(new_tags.length !== old_tags.length) {
                  differences = true;
            } {
                  for(let i = 0; i < new_tags.length; i++) {
                        if(new_tags[i] !== old_tags[i]) {
                              differences = true;
                              break;
                        }
                  }
            }

            if(differences) changes.tag_ids = new_tags;
      }

      if(updated_fields.thumbnail instanceof File) 
            changes.thumbnail = updated_fields.thumbnail;

      return changes;
}
function buildUpdateAnimeForm(updated_fields) {
      const form = new FormData();
      form.append("name", updated_fields.name);
      if(updated_fields.studio_id) form.append("studio_id", updated_fields.studio_id);
      if(updated_fields.series_id) form.append("series_id", updated_fields.series_id);
      if(updated_fields.year) form.append("year", updated_fields.year);
      if(updated_fields.rating) form.append("rating", updated_fields.rating);
      if(updated_fields.tag_ids) form.append("tag_ids", updated_fields.tag_ids);
      if(updated_fields.thumbnail) form.append("file", updated_fields.thumbnail);

      return form;
}

function resetAnimeModal() {
      selectSearch_component.resetSelectSearch([
            { id: id_selectors.anime.film_studio, placeholder: "Select studio"},
            { id: id_selectors.anime.film_series, placeholder: "Select series" },
            { id: id_selectors.anime.film_tag, placeholder: "Select tag" },
      ]);
      modal_component.resetModal(id_selectors.anime.film_form, id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, default_thumbnail);
      tags_utils.resetTagSelection(id_selectors.container.selected_tag);
}
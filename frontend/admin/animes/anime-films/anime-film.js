import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import { clone_resetForm, cloneResetForm } from "../../../components/form.component.js";
import modal_component from "../../../components/modal.component.js";
import selectSearch_component from "../../../components/select-search.component.js";
import table_component from "../../../components/table.component.js";
import css_selectors from "../../../selectors/css.selectors.js";
import id_selectors from "../../../selectors/element-id.selector.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";
import tags_utils from "../../../utils/tags.utils.js";
import { showToast } from "../../../utils/toast-notification.js";
import { uploadThumbnail } from "../../films/films.js";

export async function initAnimeFilm() {
      modal_component.initModal(id_selectors.modal.open_button, id_selectors.modal.close_button, id_selectors.modal.create_anime_film);
      selectSearch_component.initSelectSearch(id_selectors.anime.film_studio, api_configs.endpoints.getAnimeStudios, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.film_series, api_configs.endpoints.getAnimeSeries, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.film_tag, api_configs.endpoints.getAnimeTags, 'name');
      uploadThumbnail(id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, id_selectors.buttons.submit_btn);
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, 'anime-film_tag');
      renderAnimeFilms();
      createAnimeFilm();

}     

async function renderAnimeFilms() {
      const anime_films = await animes_api.getAnimeFilms();

      console.log('anime films: ', anime_films);
      const tbody = document.querySelector('#anime-films_table tbody');
      tbody.innerHTML = '';

      anime_films.forEach(async (film) => {
            const tr = table_component.createTrWithId(film._id);

            const edit_btn = await table_component.createEditBtn(css_selectors.container.edit_container, film);
            tr.appendChild(edit_btn);

            const name = table_component.createTextTd({ i_text: film.name });
            tr.appendChild(name);

            const anime_studio = await animes_api.getAnimeStudioById(film.studio_id);
            const studio = table_component.createTextTd({ i_text: anime_studio.name });
            tr.appendChild(studio);

            const anime_series = await animes_api.getAnimeSeriesById(film.series_id);
            const series = table_component.createTextTd({ i_text: anime_series.name });
            tr.appendChild(series);

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

                  const form = collectFormData();
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
                  } catch(error) {
                        console.error('Error creating anime film: ', error.message);
                        error_sweetAlert(error);
                  } finally {
                        submit_btn.disabled = false;
                        modal_component.closeModal(id_selectors.modal.create_anime_film);
                  }



            });
      } catch(error) {
            console.error('Error initializing createAnimeFilm function: ', error);
            error_sweetAlert(error);
      }
}

function collectFormData() {
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

      form.append('name', name);
      form.append('studio_id', studio_id);
      form.append('series_id', series_id);
      form.append('year', year);
      form.append('rating', rating);
      form.append('tag_ids', tags);
      form.append('file', thumbnail);

      return form;
}

async function updateAnimeFilm(film) {
      try {
            const cloned_form = cloneResetForm(id_selectors.anime.film_form);

      } catch(error) {
            console.error('Error update anime film: ', error);
            showToast(error, 'error');
      }
}

async function populateAnimeFilmForm(film) {
      
}


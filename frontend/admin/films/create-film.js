import api_configs from "../../api/api.config.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import modal_component from "../../components/modal.component.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { buildFilmForm, renderFilms, resetFilmModal } from './films.js';
import fetch_api from "../../api/fetch.api.js";

const { closeModal } = modal_component;

export async function createFilm() {
      try {
            const film_form = document.getElementById(id_selectors.films.film_form);
            film_form.addEventListener('submit', async(event) => {
                  event.preventDefault();
                  const submit_btn = document.getElementById(id_selectors.buttons.submit_btn);
                  submit_btn.disabled = true;

                  const form_data = collectFilmFormData(id_selectors.thumbnail.thumbnail_upload);
                  if(!form_data) {
                        submit_btn.disabled = false;
                        return;
                  }

                  try {
                        const result = await fetch_api.createForm(api_configs.endpoints.createFilm, form_data);
                        if(result.success === false) {
                              throw new Error(result.error);
                        }

                        success_sweetAlert("Film created successfully");
                        resetFilmModal();
                  } catch(error) {
                        console.error('Error creating film: ', error.message);
                        error_sweetAlert(error);
                  } finally {
                        submit_btn.disabled = false;
                        closeModal(id_selectors.modal.create_film);
                        renderFilms(id_selectors.table.film_tbody);
                  }
            });
      } catch(error) {
            console.error('Error initializing createFilm function: ', error);
            error_sweetAlert(error);
      }
}

function collectFilmFormData(thumbnailUpload_id) {
      const thumbnail = document.getElementById(thumbnailUpload_id).files[0];
      if(!thumbnail) {
            alert('Please upload a thumbnail before submitting');
            return null;
      } 
      return buildFilmForm(true, thumbnail);
}

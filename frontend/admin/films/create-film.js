import { get_selectedOption_byId } from "../../components/select-search.component.js";
import { build_filmForm, codeNumber_id, film_tableBody, filmCode_id, filmCollection_id, filmDate_id, filmForm_id, filmRating_id, filmStudio_id, get_filmName, get_selectedCode_option, get_selectedTags, modal_id, render_films, resetFilm_modal, selectedTag_class, selectedTag_contaienr_id, submitBtn_id, thumbnailUpload_id } from "./films.js";
import * as fetchAPI from './../../api/fetch.api.js';
import apiConfig from "../../api/api.config.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { close_modal } from "../../components/modal.component.js";

export async function create_film() {
      try {
            const film_form = document.getElementById(filmForm_id);
            film_form.addEventListener('submit', async(event) => {
                  event.preventDefault();
                  const submit_btn = document.getElementById(submitBtn_id);
                  submit_btn.disabled = true;

                  const form_data = collect_filmForm_data();
                  if(!form_data) {
                        submit_btn.disabled = false;
                        return;
                  }

                  try {
                        const result = await fetchAPI.create_form(apiConfig.endpoints.createFilm, form_data);
                        if(result.success === false) {
                              throw new Error(result.error);
                        }

                        success_sweetAlert("Film created successfully");
                        resetFilm_modal();
                  } catch(error) {
                        console.error('Error creating film: ', error.message);
                        error_sweetAlert(error);
                  } finally {
                        submit_btn.disabled = false;
                        close_modal(modal_id);
                        render_films(film_tableBody);
                  }
            });
      } catch(error) {
            console.error('Error initializing create_film function: ', error);
            error_sweetAlert(error);
      }
}

function collect_filmForm_data() {
      const thumbnail = document.getElementById(thumbnailUpload_id).files[0];
      if(!thumbnail) {
            alert('Please upload a thumbnail before submitting');
            return null;
      } 
      return build_filmForm(true, thumbnail);
}

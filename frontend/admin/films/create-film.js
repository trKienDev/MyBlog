import { get_selectedOption_byId } from "../../components/select-search.component.js";
import { build_filmForm, codeNumber_id, film_tableBody, filmForm_id, get_filmName, get_selectedCode_option, get_selectedTags, render_films, resetFilm_modal, selectedTag_class, selectedTag_contaienr_id } from "./films.js";
import * as fetchAPI from './../../api/fetch.api.js';
import apiConfig from "../../api/api.config.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { close_modal } from "../../components/modal.component.js";
import css_selectors from "../../config/css-selector.js";

export async function create_film() {
      try {
            const film_form = document.getElementById(filmForm_id);
            film_form.addEventListener('submit', async(event) => {
                  event.preventDefault();
                  const submit_btn = document.getElementById(css_selectors.SUBMIT_BTN_ID);
                  submit_btn.disabled = true;

                  const form_data = collect_filmForm_data(THUMBNAIL_UPLOAD_ID);
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
                        close_modal(css_selectors.CREATE_FILM_MODAL_ID);
                        render_films(film_tableBody);
                  }
            });
      } catch(error) {
            console.error('Error initializing create_film function: ', error);
            error_sweetAlert(error);
      }
}

function collect_filmForm_data(thumbnailUpload_id) {
      const thumbnail = document.getElementById(thumbnailUpload_id).files[0];
      if(!thumbnail) {
            alert('Please upload a thumbnail before submitting');
            return null;
      } 
      return build_filmForm(true, thumbnail);
}

import { get_selectedOption_byId } from "../../components/select-search.component.js";
import { codeNumber_id, filmCode_id, filmCollection_id, filmDate_id, filmForm_id, filmRating_id, filmStudio_id, get_filmName, get_selectedCode_option, get_selectedTags, ResetFilmModal, selectedTag_class, selectedTagContaier_id, submitBtn_id, thumbnailUpload_id } from "./films.js";
import * as fetchAPI from './../../api/fetch.api.js';
import apiConfig from "../../api/api.config.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";

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
                        const result = await submit_filmData(form_data);
                        if(result.success === false) {
                              throw new Error(result.error);
                        }
                        success_createFilm();
                  } catch(error) {
                        error_createFilm(error);
                  } finally {
                        submit_btn.disabled = false;
                  }
            });
      } catch(error) {
            console.error('Error initializing create_film function: ', error);
            error_sweetAlert(error);
      }
}

function collect_filmForm_data() {
      try {
            const studio_id = get_selectedOption_byId(filmStudio_id);
            const code_id = get_selectedCode_option(filmCode_id).getAttribute("value");
            const film_name = get_filmName(filmCode_id, codeNumber_id);
            const collection_id = get_selectedOption_byId(filmCollection_id);
            const release_date = document.getElementById(filmDate_id).value;
            const rating = document.getElementById(filmRating_id).value;

            const thumbnail_input = document.getElementById(thumbnailUpload_id);
            const thumbnail_file = thumbnail_input.files[0];
            if(!thumbnail_file) {
                  alert("Please upload a thumbnail before submitting");
                  return null;
            }

            const selected_tags = get_selectedTags(selectedTagContaier_id);

            const form_data = new FormData();
            form_data.append("studio_id", studio_id);
            form_data.append("code_id", code_id);
            form_data.append("name", film_name);
            form_data.append("collection_id", collection_id);
            form_data.append("file", thumbnail_file);
            form_data.append("date", release_date);
            form_data.append("rating", rating);
            form_data.append("tag_ids", selected_tags);

            return form_data;
      } catch(error) {
            console.error('Error in collect_filmForm_data: ', error);
            error_sweetAlert(error);
            throw error;
      }
}

async function submit_filmData(form_data) {
      try {
            return await fetchAPI.CreateItem(apiConfig.endpoints.createFilm, form_data);
      } catch(error) {
            console.error('Error in submit_filmData: ', error);
            error_sweetAlert(error);
            throw error;
      }
}

function success_createFilm() {
      success_sweetAlert("Film created successfully");
      ResetFilmModal();
}

function error_createFilm(error) {
      console.error('Error creating film: ', error.message);
      error_sweetAlert(error);
}

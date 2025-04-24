import apiConfig from "../../api/api.config.js";
import { GetCollectionName_byId } from "../../api/collection.api.js";
import { GetStudioName_byId } from "../../api/studio.api.js";
import { get_TagById } from "../../api/tag.api.js";
import { change_modalTitle, open_modal } from "../../components/modal.component.js";
import { get_selectedOption_byId, init_selectSearch, loadInfo_selectSearch } from "../../components/select-search.component.js";
import { selectCodeByStudio } from "../../components/select.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { codeNumber_id, create_tagDiv, filmCode_id, filmCollection_id, filmDate_id, filmForm_id, filmRating_id, filmStudio_id, filmTag_id, get_filmName, get_selectedCode_option, getCode_byStudio, modal_id, observe_selectChange, selectedTag_class, selectedTagContaier_id, submitBtn_id, thumbnailImg_id, thumbnailUpload_id, upload_thumbnail } from "./films.js";

export async function update_film(film) {
      try {                 
            // --* clone 1 form mới thay vì đổi id form ==> tránh việc có 2 form đang cùng tồn tại trên DOM *--
            const film_form = document.getElementById(filmForm_id);
            const cloned_form = film_form.cloneNode(true);
            film_form.parentNode.replaceChild(cloned_form, film_form);
      
            await populate_filmForm(film);

            init_selectSearch(filmStudio_id, apiConfig.endpoints.getStudios, 'name');
            init_selectSearch(filmCollection_id, apiConfig.endpoints.getCollections, 'name');
            init_selectSearch(filmTag_id, apiConfig.endpoints.getFilmTags, 'name');
            open_modal(modal_id);     
            change_modalTitle(modal_id, '#submit-btn', 'btn-create', 'btn-update', `Update ${film.name}`);
            upload_thumbnail(thumbnailImg_id, thumbnailUpload_id, submitBtn_id);
            getCode_byStudio(filmStudio_id);

            const selectedTag_container = document.getElementById(selectedTagContaier_id);
            selectedTag_container.addEventListener('click', (event) => {
                  if(event.target.classList.contains('selected-tag')) {
                        event.target.remove();
                  }
            });
            observe_selectChange(filmTag_id, ({ tag_id, tag_name}) => {
                  const existTag = Array.from(selectedTag_container.children).some(child => 
                        child.innerText === tag_name || child.getAttribute('value') === tag_id
                  );
                  if(!existTag) {
                        const tag_div = create_tagDiv(tag_id, tag_name, selectedTag_class)
                        selectedTag_container.appendChild(tag_div);
                  }
            });

            cloned_form.addEventListener('submit', async function(event) {
                  event.preventDefault();
                  const form_data = new FormData();

                  const studioId = get_selectedOption_byId(filmStudio_id);
                  const codeId = get_selectedCode_option(filmCode_id).getAttribute("value");            
                  const filmName = get_filmName(filmCode_id, codeNumber_id);
                  const collectionId = get_selectedOption_byId(filmCollection_id);         
                  const releaseDate = document.getElementById(filmDate_id).value;
                  const rating = document.getElementById(filmRating_id).value;
                  const tagNode_list = selectedTag_container.querySelectorAll('.selected-tag');
                  const selected_tags = Array.from(tagNode_list).map(div => div.getAttribute('value'));

                  const thumbnail_input = document.getElementById(thumbnailUpload_id);
                  if(thumbnail_input.files && thumbnail_input.files.length > 0) {
                        const thumbnail_file = thumbnail_input.files[0];
                        form_data.append('file', thumbnail_file);
                  }

                  form_data.append("studio_id", studioId);
                  form_data.append("code_id", codeId);
                  form_data.append("name", filmName);
                  form_data.append("collection_id", collectionId);
                  form_data.append("date", releaseDate);
                  form_data.append("rating", rating);
                  form_data.append("tag_ids", selected_tags);
                  console.log("film data: ", form_data);
                  console.log("film_id: ", film._id);
                  try {
                        const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.update_film}/${film._id}`, {
                              method: "PUT",
                              body: form_data,
                        });

                        if(!response.ok) {
                              const error = await response.json();
                              throw new Error(`Error: ${error}`);
                        }

                        success_sweetAlert('film updated');
                  } catch(error) {
                        console.error('Error of update_film in server: ', error);
                        error_sweetAlert(error);
                  }

            });
      } catch(error) {
            console.error('Error in update_film: ', error);
            error_sweetAlert(error);
      }
}

async function populate_filmForm(film) {
      await loadInfo_selectSearch(film, filmStudio_id, 'studio_id', GetStudioName_byId);
      await selectCodeByStudio(filmCode_id, film.studio_id);
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

      const selectTag_container = document.getElementById(selectedTagContaier_id);

      film.tag_ids.forEach(async(tag_el) => {
            const tag = await get_TagById(tag_el);
            const tag_div = create_tagDiv(tag._id, tag.name, selectedTag_class);
            selectTag_container.appendChild(tag_div);
      });
      
      const film_thumbnail = document.getElementById(thumbnailImg_id);
      film_thumbnail.src = `${apiConfig.server}/uploads/film/${film.thumbnail}`;
} 
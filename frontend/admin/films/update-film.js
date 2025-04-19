import { GetCollectionName_byId } from "../../api/collection.api.js";
import { GetStudioName_byId } from "../../api/studio.api.js";
import { openModal } from "../../components/modal.component.js";
import { LoadInfo_selectSearch } from "../../components/select-search.component.js";
import { selectCodeByStudio } from "../../components/select.component.js";

import { filmCode_id, filmCollection_id, filmDate_id, filmRating_id, filmStudio_id, getSelectedCodeOpt, modalId } from "./films.js";

export async function updateFilm(film) {
      openModal(modalId);     
      const modal = document.getElementById(modalId),
      h2_el = modal.querySelector('h2');
      const submit_btn = modal.querySelector('#submit-btn');
      submit_btn.classList.remove('btn-create');
      submit_btn.classList.add('btn-update');
      h2_el.innerText = `Update ${film.name}`;
      console.log("film: ", film);

      await LoadInfo_selectSearch(film, filmStudio_id, 'studio_id', GetStudioName_byId);
      await LoadInfo_selectSearch(film, filmCollection_id, 'collection_id', GetCollectionName_byId);
      selectCodeByStudio(filmCode_id, film.studio_id);

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

      
}



import { getCode_byId } from "../../api/code.api.js";
import { GetStudioName_byId } from "../../api/studio.api.js";
import { openModal } from "../../components/modal.component.js";

import { filmCode_id, filmStudio_id, getSelectedCodeOpt, modalId } from "./films.js";

export async function updateFilm(film) {
      openModal(modalId);     
      const modal = document.getElementById(modalId),
      h2_el = modal.querySelector('h2');
      const submit_btn = modal.querySelector('#submit-btn');
      submit_btn.classList.remove('btn-create');
      submit_btn.classList.add('btn-update');
      h2_el.innerText = `Update ${film.name}`;
      console.log("film: ", film);

      await loadStudio(film);

      const filmCode_option = getSelectedCodeOpt(filmCode_id);
      filmCode_option.innerText = 'Hello';
      const filmCode = getCode_byId(film.code_id);

}

async function loadStudio(film) {
      const filmStudio_el = document.getElementById(filmStudio_id),
      filmStudio_span = filmStudio_el.querySelector('span');
      filmStudio_span.setAttribute('item-id', film.studio_id);
      filmStudio_span.innerText = await GetStudioName_byId(film.studio_id);
}




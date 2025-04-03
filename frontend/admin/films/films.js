import { ResetModal, SetupModalHandlers } from "../../components/modal.component.js";
import { selectCodeByStudio, SelectCodes, selectCreators, SelectFilmTags, SelectStudios } from "../../components/select.component.js";
let modalId = "create-modal";

let filmStudio = 'film-studio';
let filmCode = 'film-code';
let filmTag = 'film-tag';

export function initFilmAdmin() {
      SetupModalHandlers("open-modal_button", "close-modal_button", modalId);
      CreateNewFilm();
      SelectStudios(filmStudio);
      SelectFilmTags(filmTag);
      GetStudioSelected();
}

async function CreateNewFilm() {

}

function GetStudioSelected() {
      const studio = document.getElementById(filmStudio);
      studio.addEventListener("change", function(event) {
            const value = event.target.value;
            return getCodeByStudio(value);
      });
}

function getCodeByStudio(studio_id) {
      selectCodeByStudio(filmCode, studio_id);
}

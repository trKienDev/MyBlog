import code_api from "../../api/code.api.js";
import { film_api } from "../../api/film.api.js";
import { studio_api } from "../../api/studio.api.js";
import doms_component from "../../components/doms.component.js";
import film_component from "../../components/films.component.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import activeState_utils from "../../utils/active-state.js";

export async function StudioInforController(studio_id) {
      PopulateStudioName(studio_id);
      RenderStudioCodes(studio_id);
      RenderStudioFIlms(studio_id);
      
}

async function PopulateStudioName(studio_id) {
      const studio_name = await studio_api.getStudioNameById(studio_id);
      const studioName_div = document.getElementById('studio-name');  
      const studioName_heading = doms_component.createH3(studio_name, 'studio-name');
      studioName_div.appendChild(studioName_heading);
}

async function RenderStudioCodes(studio_id) {
      const studioCodes_element = document.getElementById('studio-codes');
      const studioCodes_container = studioCodes_element.querySelector('.studio-codes_container');

      const studio_codes = await code_api.GetCodesByStudioId(studio_id);
      studio_codes.forEach(code => {
            const studio_code = doms_component.createDiv('studio-code', code.code);
            studio_code.setAttribute('data-id', code._id);
            studioCodes_container.appendChild(studio_code);
      });
      activeState_utils.InitializeActiveState('studio-code', (activatedCode) => {
            HandleActiveCode(activatedCode, studio_id);
      });

      studioCodes_element.appendChild(studioCodes_container);

      return studioCodes_element;
}
function HandleActiveCode(activatedCode, studio_id) {
      const code_id = activatedCode.getAttribute('data-id');
      RenderStudioFIlmsByCode(studio_id, code_id);
}
async function RenderStudioFIlms(studio_id) {
      const studioFIlms_element = document.getElementById('studio-films');
      const studioFilms_container = studioFIlms_element.querySelector('.studio-films_container');
      studioFilms_container.innerHTML = '';

      const films = await film_api.GetFilmsByStudioId(studio_id);
      films.forEach(film => {
            const film_article = film_component.CreateFilmThumbnailFrame(film, ServerFolders.FILMS);
            studioFilms_container.appendChild(film_article);
      });
      return studioFIlms_element;
}
async function RenderStudioFIlmsByCode(studio_id, code_id) {
      const studioFIlms_element = document.getElementById('studio-films');
      const studioFilms_container = studioFIlms_element.querySelector('.studio-films_container');
      studioFilms_container.innerHTML = '';

      const films = await film_api.getFilmsByStudioCode(studio_id, code_id);
      films.forEach(film => {
            const film_article = film_component.CreateFilmThumbnailFrame(film, ServerFolders.FILMS);
            studioFilms_container.appendChild(film_article);
      });
      return studioFIlms_element;
}


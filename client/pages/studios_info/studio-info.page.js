import { film_api } from "../../api/film.api.js";
import { studio_api } from "../../api/studio.api.js";
import doms_component from "../../components/doms.component.js";

export async function StudioInforController(studio_id) {
      const studio_name = await studio_api.getStudioNameById(studio_id);
      const studioName_div = document.getElementById('studio-name');  
      const studioName_heading = doms_component.createH3(studio_name, 'studio-name');
      studioName_div.appendChild(studioName_heading);

      const films = await film_api.GetFilmsByStudioId(studio_id);
      console.log('films: ', films);
}
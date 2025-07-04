import { film_api } from "../../api/film.api.js";
import film_component from "../../components/films.component.js";
import { ServerFolders } from "../../constants/folders.constant.js";

export async function FilmSectionController() {
      const listFilms_section = document.getElementById('list-films_section'),
      listFilmsSection_wrapper = listFilms_section.querySelector('.list-films_section-wrapper');
      listFilmsSection_wrapper.innerHTML = '';      

      const films = await film_api.GetFilms();
      films.forEach(film => {
            const film_article = film_component.CreateFilmThumbnailFrame(film, ServerFolders.FILMS);
            listFilmsSection_wrapper.appendChild(film_article);
      });
}

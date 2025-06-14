import { film_api } from "../../api/film.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import app_configs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import date_utils from "../../utils/date.utils.js";
import image_utils from "../../utils/image.utils.js";

export async function FilmSectionController() {
      const listFilms_section = document.getElementById('list-films_section'),
      listFilmsSection_wrapper = listFilms_section.querySelector('.list-films_section-wrapper');
      listFilmsSection_wrapper.innerHTML = '';      

      const films = await film_api.GetFilms();
      films.forEach(film => {
            const film_article = CreateFilmThumbnailFrame(film);
            listFilmsSection_wrapper.appendChild(film_article);
      });
}

function CreateFilmThumbnailFrame(film) {
      const film_article = doms_component.createArticle('film-article');
      const filmArticle_container = doms_component.createDiv('film-article_container');
      film_article.appendChild(filmArticle_container);

      const filmArticle_ahref = doms_component.createAhref({
            href: `film/#id=${film._id}`,
            css_class: 'film-article_link',
      });
      filmArticle_container.appendChild(filmArticle_ahref);

      const filmThumbnail_container = doms_component.createDiv('film-thumbnail_container');
      const filmThumbnail_image = images_component.createImg(null, 'film-thumbnail_image');
      filmThumbnail_image.src = `${app_configs.SERVER}/${ServerFolders.FILMS}/${film.thumbnail}`;
      filmThumbnail_container.appendChild(filmThumbnail_image);
      filmArticle_ahref.appendChild(filmThumbnail_container);
      image_utils.addEffectHoverToZoomImage(filmThumbnail_container, filmThumbnail_image);

      const filmInfor_div = doms_component.createDiv('film-infor_container');
      
      const filmName_div = doms_component.createDiv('film-name');
      filmName_div.textContent = film.name;
      filmInfor_div.appendChild(filmName_div);

      const filmDate_str = date_utils.getDateFromStr(new Date(film.date));
      const filmDate_div = doms_component.createDiv('film-date');
      filmDate_div.textContent = filmDate_str;
      filmInfor_div.appendChild(filmDate_div);

      filmArticle_ahref.appendChild(filmInfor_div);
      return film_article;
}
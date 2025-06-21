import { film_api } from "../../api/film.api.js";
import tag_api from "../../api/tag.api.js";
import doms_component from "../../components/doms.component.js";
import film_component from "../../components/films.component.js";
import tags_component from "../../components/tags.component.js";
import ClientSections from "../../constants/client-sections.constant.js";
import { PaginedVideosSectionController } from "../../sections/pagined-videos/pagined-videos.section.js";
import spa_renderHTML from "../../services/spa/render-html.js";

export async function TagInforController(tag_id) {
      const tagName_div = document.getElementById('tag-name');

      const list_media = document.getElementById('list-media');

      const tag_info = await tag_api.getTagById(tag_id);
      switch(tag_info.kind) {
            case 'film': 
                  RenderTagByFilm(tag_id, list_media);
                  break;
            case 'creator':
                  RenderTagByCreator(tag_id, list_media);
                  break;
            default: 
                  RenderTagByVideo(tag_id, list_media);
                  break;
      }

      const tagInfor_div = await tags_component.createTagDivFromAPI({ tag_id: tag_id, tag_css: 'tag-item' });
      console.log('tag infor: ', tagInfor_div);
      tagName_div.appendChild(tagInfor_div);
      
}

async function RenderTagByFilm(tag_id, list_media) {
      const listFilm_sectionWrapper = doms_component.createDiv('list-films_section-wrapper');

      const films = await film_api.GetFilmsByTagId(tag_id);
      films.forEach(film => {
            const film_article = film_component.CreateFilmThumbnailFrame(film);
            listFilm_sectionWrapper.appendChild(film_article);
      });
      list_media.appendChild(listFilm_sectionWrapper);
}

function RenderTagByVideo(tag_id, list_media) {
      const video_section = doms_component.CreateSection({ id: 'pagined-videos' });
      spa_renderHTML.loadContentFromUrl(ClientSections.NEWVIDEOS, 'list-media', () => PaginedVideosSectionController('pagined-videos', { tag_id: tag_id }));
      list_media.appendChild(video_section);
}
function RenderTagByCreator(tag_id) {
      alert('creator');
}
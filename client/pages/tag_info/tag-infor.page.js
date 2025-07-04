import creator_api from "../../api/creator.api.js";
import { film_api } from "../../api/film.api.js";
import tag_api from "../../api/tag.api.js";
import doms_component from "../../components/doms.component.js";
import film_component from "../../components/films.component.js";
import images_component from "../../components/image.component.js";
import tags_component from "../../components/tags.component.js";
import ClientSections from "../../constants/client-sections.constant.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import videoPagination_section from "../../sections/pagination-videos/pagination-videos.section.js";
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
      tagName_div.appendChild(tagInfor_div);
}

async function RenderTagByFilm(tag_id, list_media) {
      const listFilm_sectionWrapper = doms_component.createDiv('list-films_section-wrapper');

      const films = await film_api.GetFilmsByTagId(tag_id);
      films.forEach(film => {
            const film_article = film_component.CreateFilmThumbnailFrame(film, ServerFolders.FILMS);
            listFilm_sectionWrapper.appendChild(film_article);
      });
      list_media.appendChild(listFilm_sectionWrapper);
}

async function RenderTagByVideo(tag_id, list_media) {
      const tag_info = await tag_api.getTagById(tag_id);
      if(tag_info.kind === "action") {
            spa_renderHTML.loadContentFromUrl(ClientSections.NEWVIDEOS, 'list-media', () => videoPagination_section.PaginedVideosSectionController('videos-pagination_section', { action_id: tag_id }));
      } else {
            spa_renderHTML.loadContentFromUrl(ClientSections.NEWVIDEOS, 'list-media', () => videoPagination_section.PaginedVideosSectionController('videos-pagination_section', { tag_id: tag_id }));
      }
      const video_section = doms_component.CreateSection({ id: 'videos-pagination_section' });
      
      list_media.appendChild(video_section);
}

async function RenderTagByCreator(tag_id, list_media) {
      const creators = await creator_api.GetCreatorsByTagId(tag_id);
      
      const listCreators_sectionWrapper = doms_component.createDiv('list_creators-section_wrapper');
      creators.forEach(async (creator) => {
            const creator_wrapper = doms_component.createDiv('creator-wrapper');
            const creator_avatar = await images_component.createCreatorAvatar(creator._id);
            creator_wrapper.appendChild(creator_avatar);
            const creator_name = doms_component.createDiv('creator-name', creator.name);
            creator_wrapper.appendChild(creator_name);
            listCreators_sectionWrapper.appendChild(creator_wrapper);
      });

      list_media.appendChild(listCreators_sectionWrapper);
      return list_media;
}
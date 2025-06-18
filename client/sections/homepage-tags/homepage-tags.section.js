import tag_api from "../../api/tag.api.js";
import doms_component from "../../components/doms.component.js";
import tags_component from "../../components/tags.component.js";

export async function HomepageTagsSectionController() {
      const listTags_element = document.getElementById('list-tags');
      const listTags_container = listTags_element.querySelector('.list-tags_container');
      
      RenderFilmTags();
      RenderVideoTags();
      RenderCreatorTags();
}

async function RenderFilmTags() {
      const filmTags_element = document.getElementById('film-tags');
      const filmTags_container = filmTags_element.querySelector('.film-tags_container');

      const film_tags = await tag_api.GetTagsByFilm();
      film_tags.forEach(async (tag) => {
            const film_tag =  await tags_component.createTagDivFromAPI({ tag_id: tag._id, tag_css: 'tag-item'});
            filmTags_container.appendChild(film_tag);
      });
}

async function RenderVideoTags() {
      const videoTags_element = document.getElementById('video-tags');
      const videoTags_container = videoTags_element.querySelector('.video-tags_container');

      const video_tags = await tag_api.GetTagsByVideo();
      video_tags.forEach(async (tag) => {
            const video_tag = await tags_component.createTagDivFromAPI({ tag_id: tag._id, tag_css: 'tag-item'});
            videoTags_container.appendChild(video_tag);
      });
}

async function RenderCreatorTags() {
      const creatorTags_element = document.getElementById('creator-tags');
      const creatorTags_container = creatorTags_element.querySelector('.creator-tags_container');

      const creator_tags = await tag_api.GetTagsByCreator();
      creator_tags.forEach(async (tag) => {
            const creator_tag = await tags_component.createTagDivFromAPI({ tag_id: tag._id, tag_css: 'tag-item'});
            creatorTags_container.appendChild(creator_tag);
      });
}


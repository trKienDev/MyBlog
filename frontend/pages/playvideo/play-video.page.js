import { film_api } from "../../api/film.api.js";
import tag_api from "../../api/tag.api.js";
import { video_api } from "../../api/video.api.js";
import images_component from "../../components/image.component.js";
import span_component from "../../components/span.component.js";
import tags_component from "../../components/tags.component.js";
import thumbnail_component from "../../components/thumbnail.component.js";
import videos_component from "../../components/videos.component.js";
import dom_id from "../../constants/doms.constant.js";
import { ServerFolders } from "../../constants/folders.constant.js";

export async function playVideoPageController(id) {
      const video = await video_api.getVideoById(id);
      console.log('video: ', video);
      
      renderVideoData(video);
      renedrFilmData(video.film_id);

      const video_creator = document.getElementById('video-creator');
      const creator_avatar = await images_component.createCreatorAvatar(video.creator_id);
      video_creator.appendChild(creator_avatar);
}

async function renderVideoData(video) {
      videos_component.updateVideoSourceById({element_id: dom_id.VIDEO_PLAYER, ivideo: video, upload_path: ServerFolders.VIDEOS });
      updateVideoActionData(video);
      updateVideoFilm(video);
      span_component.updateSpanText(dom_id.VIDEO_TOTAL_VIEWS, video.views);
      span_component.updateSpanText(dom_id.VIDEO_TOTAL_LIKES, video.likes);
}

function renedrFilmData(film_id) {
      thumbnail_component.updateFilmThumbnailSource({ film_id: film_id, thumbnailElement_id: dom_id.VIDEO_FILM_THUMBNAIL, upload_path: `${ServerFolders.FILMS}`});
}

async function updateVideoFilm(video) {
      const video_film = await film_api.getFilmNameById(video.film_id);
      span_component.updateSpanText(dom_id.VIDEO_FILM_NAME, video_film);
}

async function updateVideoActionData(video) {
      const video_action = document.getElementById(dom_id.VIDEO_ACTION);
      const action_tag = await tags_component.createTagDivFromAPI({ tag_field: video.action_id, tag_css: 'tag-item' });
      video_action.appendChild(action_tag);

      return video_action;
}
import tag_api from "../../api/tag.api.js";
import { video_api } from "../../api/video.api.js";
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
}

async function renderVideoData(video) {
      videos_component.updateVideoSourceById({element_id: dom_id.VIDEO_PLAYER, ivideo: video, upload_path: ServerFolders.VIDEOS });
      span_component.updateSpanText(dom_id.VIDEO_NAME, video.name);
      
      const videoAction_element = document.getElementById('video-action');
      const video_action = await tag_api.getTagById(video.action_id);
      const action_tag = tags_component.createTagItem(video_action, 'tag-item');
      videoAction_element.appendChild(action_tag);
}

function renedrFilmData(film_id) {
      thumbnail_component.updateFilmThumbnailSource({ film_id: film_id, thumbnailElement_id: dom_id.VIDEO_FILM_THUMBNAIL, upload_path: `${ServerFolders.FILMS}`});
}
import api_configs from "../../api/api.config.js";
import { film_api } from "../../api/film.api.js";
import { video_api } from "../../api/video.api.js";
import thumbnail_component from "../../components/thumbnail.component.js";
import videos_component from "../../components/videos.component.js";
import { ServerFolders } from "../../constants/folders.constant.js";

export async function playVideoPageController(id) {
      const video = await video_api.getVideoById(id);
      console.log('video: ', video);
      console.log('file path: ', video.file_path);
      
      renderVideoData(video);
}

function renderVideoData(video) {
      videos_component.updateVideoSourceById({element_id: 'video-player', ivideo: video, upload_path: 'uploads/videos' });
      thumbnail_component.updateFilmThumbnailSource({ video: video, thumbnailElement_id: 'video_film-thumbnail', upload_path: `${ServerFolders.FILMS}`});
}





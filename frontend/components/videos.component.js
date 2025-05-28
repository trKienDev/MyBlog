import app_configs from "../config/app.config.js";
import id_selectors from "../selectors/element-id.selector.js";

function createVideoPreview(css_class) {
      const video = document.createElement('video');
      video.classList.add(css_class);
      video.controls = false;
      video.muted = true;
      
      return video;
}
function createVideoSource(file_path) {
      const source = document.createElement('source');
      source.src = file_path;
      source.type = 'video/mp4';

      return source;
}

function populateVideo(ivideo, upload_path) {
      const video_url = `${app_configs.SERVER}/${upload_path}/${ivideo.file_path}`;
      const video_element = document.querySelector('video');
      const source_element = video_element.querySelector('source');
      const thumbnail_image = document.getElementById(id_selectors.videos.thumbnail_video);
      source_element.src = video_url;
      video_element.load();
      video_element.classList.remove('d-none');
      thumbnail_image.style.display = 'none';
}

function updateVideoSourceById({element_id, ivideo, upload_path}) {
      const video_url = `${app_configs.SERVER}/${upload_path}/${ivideo.file_path}`;
      const video_element = document.getElementById(element_id);
      
      const source_element = video_element.querySelector('source');
      source_element.src = video_url;
      video_element.load();

      return video_element;
}

const videos_component = {
      createVideoPreview,
      createVideoSource,
      populateVideo,
      updateVideoSourceById,
}
export default videos_component;
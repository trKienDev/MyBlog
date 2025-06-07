import app_configs from "../config/app.config.js";
import css_class from "../constants/css.constant.js";
import { ServerFolders } from "../constants/folders.constant.js";
import id_selectors from "../selectors/element-id.selector.js";
import doms_component from "./doms.component.js";

function createVideoPlayer(video_name, video_filepath) {
      const video_container = doms_component.createDiv('video-container');

      const videoSrc_ahref = doms_component.createAhref({ css_class: 'video-link'});
      videoSrc_ahref.setAttribute('arial-label', `Watch video: ${video_name}`);

      let video_frame = createVideoPreview(css_class.VIDEO_FRAME);

      const video_src = videos_component.createVideoSource(`${app_configs.SERVER}/${ServerFolders.VIDEOS}/${video_filepath}`);
      
      video_frame.appendChild(video_src);
      video_container.appendChild(video_frame);

      return video_container;
}

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

function hoverMouseVideoToPlay(video_ahref) {
      let playTimeout; 
      
      video_ahref.addEventListener('mouseenter', () => {
            const video_element = video_ahref.querySelector('video');
            if(video_element) {
                  playTimeout = setTimeout(() => {
                        video_element.play().catch(error => {
                              if (error.name !== 'AbortError') {
                                    console.warn('Video play failed: ', error);
                              }
                        });
                  }, 300);
            }
      });
      video_ahref.addEventListener('mouseleave', () => {
            clearTimeout(playTimeout);
            const video_element = video_ahref.querySelector('video');
            if(video_element) {
                  video_element.pause();
            }
      });

      return video_ahref;
}

const videos_component = {
      createVideoPlayer,
      createVideoPreview,
      createVideoSource,
      populateVideo,
      updateVideoSourceById,
      hoverMouseVideoToPlay,
}
export default videos_component;
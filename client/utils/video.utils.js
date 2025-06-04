import video_helpers from "../admin/videos/video.helper.js";
import api_configs from "../api/api.config.js";
import id_selectors from "../selectors/element-id.selector.js";

function clickMouseToPlayVideo(video) {
      video.addEventListener('click', () => { video.play(); });
      leaveMouseToStopVideo(video);
      return video
}
function hoverMouseToPlayVideo(video) {
      video.addEventListener('mouseenter', () => { video.play(); });
      leaveMouseToStopVideo(video);
      return video
}
function leaveMouseToStopVideo(video) {
      video.addEventListener('mouseleave', () => { video.pause(); });
}
function waitForUploadVideo(thumbnail_video, upload_video) {
      const thumbnail = document.getElementById(thumbnail_video);
      const upload_input = document.getElementById(upload_video);

      thumbnail.addEventListener('click', () => {
            upload_input.click();
      });

      upload_input.addEventListener('change', video_helpers.handleVideoUpload);
}
function resetVideoPreview() {
      const video_element = document.querySelector('video');
      const source_element = video_element.querySelector('source');
      const thumbnail_image = document.getElementById(id_selectors.videos.thumbnail_video);
      const upload_input = document.getElementById(id_selectors.videos.upload_video);

      source_element.src = "";
      video_element.load();

      video_element.classList.add('d-none');
      thumbnail_image.style.display = "";
      upload_input.value = "";
}

function waitForUploadNewVideo() {
      const upload_btn = document.getElementById(id_selectors.videos.upload_new_video);
      const upload_input = document.getElementById(id_selectors.videos.upload_video);
      upload_btn.addEventListener('click', () => {
            upload_input.click();
      });

      upload_input.addEventListener('change', video_helpers.handleVideoUpload);
}

const video_utils = {
      hoverMouseToPlayVideo,
      clickMouseToPlayVideo,
      waitForUploadVideo,
      waitForUploadNewVideo,
      resetVideoPreview,
};
export default video_utils;
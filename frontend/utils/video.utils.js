function hoverMouseToPlayVideo(video) {
      video.addEventListener('click', () => { video.play(); });
      video.addEventListener('mouseleave', () => { video.pause(); });
      return video
}

const video_utils = {
      hoverMouseToPlayVideo,
};
export default video_utils;
function hoverMouseToPlayVideo(video) {
      video.addEventListener('mouseenter', () => { video.play(); });
      video.addEventListener('mouseleave', () => { video.pause(); });
      return video
}

const video_utils = {
      hoverMouseToPlayVideo,
};
export default video_utils;
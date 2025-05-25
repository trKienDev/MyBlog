function createVideo(css_class) {
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


const videos_component = {
      createVideo,
      createVideoSource,
}
export default videos_component;
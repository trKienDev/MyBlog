import api_configs from "../../api/api.config.js";
import { video_api } from "../../api/video.api.js";
import { spaNavigateLink } from "../../services/loadElement/load-dynamic-section.js";
import { error_sweetAlert } from "../../utils/sweet-alert.js";
import { initCreateVideo } from "./create-video.js";

let createVideo_btnId = 'create-video';

export async function initVideoAdmin() {
      spaNavigateLink(createVideo_btnId, api_configs.endpoints.adminCreateVideoPage, initCreateVideo);
      renderListVideo();
}     

async function renderListVideo() {
      const list_videos = document.getElementById('list-videos');
      
      try {
            const videos = await video_api.getVideos();
            videos.forEach(video => {
                  console.log('video: ', video);
                  const video_item = document.createElement('div');
                  video_item.classList.add('video-item');
                  
            })            
      } catch(error) {
            console.error('Error in renderListVideo: ', error);
            error_sweetAlert('Error loading videos: ', error.message);
      }
}





import api_configs from "./api.config.js";
import fetch_api from "./fetch.api.js";

async function getVideos() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getVideos);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

async function updateVideo(video_id, form_data) {
      const result = await fetch_api.updateForm(`${api_configs.endpoints.updateVideo}/${video_id}`, form_data);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

export const video_api = {
      getVideos,
      updateVideo,
}
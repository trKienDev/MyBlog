import api_configs from "./api.config.js";
import fetch_api from "./fetch.api.js";

async function getVideos() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getVideos);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

export const video_api = {
      getVideos,
}
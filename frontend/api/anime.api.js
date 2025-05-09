import api_configs from "./api.config.js";
import fetch_api from "./fetch.api.js";

async function getAnimeStudios() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimeStudios);
      if(result.success === false) 
            throw new Error(result.error);

      return result.data;
}

async function getAnimeSeries() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimeSeries);
      if(result.success === false)
            throw new Error(result.error);

      return result.data;
}

const animes_api = {
      getAnimeStudios,
      getAnimeSeries,
}
export default animes_api;
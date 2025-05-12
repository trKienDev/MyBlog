import api_configs from "./api.config.js";
import fetch_api from "./fetch.api.js";

async function getAnimeStudios() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimeStudios);
      if(result.success === false) 
            throw new Error(result.error);

      return result.data;
}
async function getAnimeStudioById(id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getAnimeStudioById}/${id}`);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

async function getAnimeSeries() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimeSeries);
      if(result.success === false)
            throw new Error(result.error);

      return result.data;
}
async function getAnimeSeriesById(id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getAnimeSeriesById}/${id}`);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}


async function getAnimeTags() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimeTags);
      if(result.success === false)
            throw new Error(result.error);

      return result.data;
}

async function getAnimeFilms() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimeFilms);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

const animes_api = {
      getAnimeStudioById,
      getAnimeStudios,
      getAnimeSeries,
      getAnimeSeriesById,
      getAnimeTags,
      getAnimeFilms,
}
export default animes_api;
import api_configs from "./api.config.js";
import fetch_api from "./fetch.api.js";

async function findFilmById(film_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.findFilmById}/${film_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data;
}

async function getFilmThumbnail(film_id) {
      const film = await findFilmById(film_id);
      return film.thumbnail;
}

async function getFilmsByStudioCode(studio_id, code_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.findFilmsByStudioCode}/${studio_id}/${code_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data;
}


export const film_api = {
      getFilmsByStudioCode,
      getFilmThumbnail,
}

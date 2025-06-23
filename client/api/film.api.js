import api_configs from "./api.config.js";
import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetFilms() {
      const result = await fetch_api.apiGet(api_user.getFilms);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data;
}
async function findFilmById(film_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.findFilmById}/${film_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data;
}
async function getFilmNameById(film_id) {
      const film = await findFilmById(film_id);
      return film.name;
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
async function GetFilmsByCreatorId(creator_id) {
      const result = await fetch_api.apiGet(`${api_user.getFilmsByCreatorId}/${creator_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
async function GetFilmsByTagId(tag_id) {
      const result = await fetch_api.apiGet(`${api_user.getFilmsByTagId}/${tag_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
async function GetFilmsByStudioId(studio_id) {
      const result = await fetch_api.apiGet(`${api_user.getFilmsByStudioId}/${studio_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
async function GetFilmsByCollectionId(collection_id) {
      const result = await fetch_api.apiGet(`${api_user.getFilmsByCollection}/${collection_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

export const film_api = {
      GetFilms,
      findFilmById,
      GetFilmsByTagId,
      getFilmNameById,
      getFilmsByStudioCode,
      getFilmThumbnail,
      GetFilmsByCreatorId,
      GetFilmsByStudioId,
      GetFilmsByCollectionId,
}

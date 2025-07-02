import { showToast } from "../utils/toast-notification.js";
import api_configs from "./api.config.js";
import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

// Studios
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
async function getAnimeStudioNameById(id) {
      const result = await getAnimeStudioById(id);
      return result.name;
}

// Series
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
async function getAnimeSeriesNameById(id) {
      const result = await getAnimeSeriesById(id);
      return result.name;
}

// Tags
async function getAnimeTags() {
      const result = await fetch_api.apiGet(api_user.getTagsByAnime);
      if(result.success === false)
            throw new Error(result.error);

      return result.data;
}
async function getAnimeTagById(id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getAnimeTagById}/${id}`);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}
async function getAnimeTagNameById(id) {
      const result = await getAnimeTagById(id);
      return result.name;
}

// Films
async function getAnimeFilms() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimeFilms);
      if(result.success === false) {
            throw new Error(result.error);
      }
      
      return result.data;
}
async function getAnimeFilmById(id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getAnimeFilmById}/${id}`);
      if(result.success === false) 
            throw new Error(result.error);

      return result.data
}
async function getAnimeFilmNameById(id) {
      const anime = await getAnimeFilmById(id);
      return anime.name;
}
async function getAnimeFilmThumbnailById(id) {
      const anime = await getAnimeFilmById(id);
      return anime.thumbnail;
}

// playlist
async function getAnimePlaylists() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimePlaylists);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
async function getAnimePlaylistById(id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getAnimePlaylistById}/${id}`);
      if(result.success === false) {
            showToast('Error get anime playlist by id', 'error');
            console.error('Error getting anime playlist: ', result.error);
            throw new Error(result.error);
      }

      return result.data;
}
async function getAnimePlaylistNameById(id) {
      const anime = await getAnimePlaylistById(id);
      return anime.name;
}

// videos
async function getAnimeVideos() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getAnimeVideos);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function GetAnimeVideoById(id) {
      const result = await fetch_api.apiGet(`${api_user.GetAnimeVideoById}/${id}`);
      if(result.success === false) throw new Error(result.error);
      return result.data;
}

const animes_api = {
      getAnimeStudios,
      getAnimeStudioById,
      getAnimeStudioNameById,
      getAnimeSeries,
      getAnimeSeriesById,
      getAnimeSeriesNameById,
      getAnimeTags,
      getAnimeTagById,
      getAnimeTagNameById,
      getAnimeFilms,
      getAnimeFilmById,
      getAnimeFilmNameById,
      getAnimeFilmThumbnailById,
      getAnimePlaylists,
      getAnimePlaylistById,
      getAnimePlaylistNameById,
      getAnimeVideos,
      GetAnimeVideoById,
}
export default animes_api;
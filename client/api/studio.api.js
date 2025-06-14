import api_configs from './api.config.js';
import { api_user } from './endpoint.api.js';
import fetch_api from './fetch.api.js';

async function GetStudios() {
      const result = await fetch_api.apiGet(`${api_user.GetStudios}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function getStudioById(studio_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getStudioById}/${studio_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function getStudioImgById(studio_id) {
      const result = await getStudioById(studio_id);
      return result.image;
}

async function getStudioNameById(studio_id) {
      const result = await getStudioById(studio_id);
      return result.name;
}

export const studio_api = {
      GetStudios,
      getStudioById,
      getStudioNameById,
      getStudioImgById,
}
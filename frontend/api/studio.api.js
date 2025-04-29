import api_configs from './api.config.js';
import fetch_api from './fetch.api.js';

export async function getStudioById(studio_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getStudioById}/${studio_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

export async function GetStudioName_byId(studio_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getStudioById}/${studio_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data.name;
}
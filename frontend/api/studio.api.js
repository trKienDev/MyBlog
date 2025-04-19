import apiConfig from './api.config.js';
import * as fetchAPI from './fetch.api.js';

export async function GetStudioById(studio_id) {
      const result = await fetchAPI.Get(`${apiConfig.endpoints.getStudioById}/${studio_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

export async function GetStudioName_byId(studio_id) {
      const result = await fetchAPI.Get(`${apiConfig.endpoints.getStudioById}/${studio_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data.name;
}
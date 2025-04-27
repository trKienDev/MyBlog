import api_configs from './api.config.js';
import * as fetchAPI from './fetch.api.js';

export async function GetCollectionName_byId(id) {
      const result = await fetchAPI.get(`${api_configs.endpoints.getCollection_byId}/${id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data.name;
}
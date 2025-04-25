import apiConfig from './api.config.js';
import * as fetchAPI from './fetch.api.js';

export async function get_TagById(tag_id) {
      const result = await fetchAPI.get(`${apiConfig.endpoints.getTag_byId}/${tag_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
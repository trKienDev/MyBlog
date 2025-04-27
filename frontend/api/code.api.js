import api_configs from './api.config.js';
import * as fetchAPI from './fetch.api.js';

export async function getCode_byId(code_id) {
      const result = await fetchAPI.get(`${api_configs.endpoints.getCode_byId}/${code_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
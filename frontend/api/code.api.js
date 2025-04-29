import api_configs from './api.config.js';
import fetch_api from './fetch.api.js';

export async function getCode_byId(code_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getCode_byId}/${code_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
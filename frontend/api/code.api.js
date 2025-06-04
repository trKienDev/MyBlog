import api_configs from './api.config.js';
import fetch_api from './fetch.api.js';

export async function getCodeById(code_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getCodeById}/${code_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
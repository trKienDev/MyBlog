import api_configs from './api.config.js';
import { api_user } from './endpoint.api.js';
import fetch_api from './fetch.api.js';

export async function getCodeById(code_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getCodeById}/${code_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function GetAllCodes() {
      const result = await fetch_api.apiGet(api_user.getCodes);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

async function GetCodesByStudioId(studio_id) {
      const result = await fetch_api.apiGet(`${api_user.GetCodesByStudio}/${studio_id}`);
      if(result.success === false) throw new Error(result.error);

      return result.data;
}

const code_api = {
      GetAllCodes,
      GetCodesByStudioId,
}
export default code_api;
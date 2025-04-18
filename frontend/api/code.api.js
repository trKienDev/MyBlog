// export async function GetStudioById(studio_id) {
//       const result = await fetchAPI.GetList(`${apiConfig.endpoints.getStudioById}/${studio_id}`);
//       if(result.success === false) {
//             throw new Error(result.error);
//       }

//       return result.data;
// }
import apiConfig from './api.config';
import * as fetchAPI from './fetch.api.js';

export async function getCode_byId(code_id) {
      const result = await fetchAPI.GetList(`${apiConfig.endpoints.getCode_byId}/${code_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
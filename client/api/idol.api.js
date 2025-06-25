import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetAllIdols() {
      const result = await fetch_api.apiGet(api_user.getAllIdols);
      if(result.success === false) 
            throw new Error(result.error);

      return result.data;
}

const idol_api = {
      GetAllIdols,
}
export default idol_api;
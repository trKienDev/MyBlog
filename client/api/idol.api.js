import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetAllIdols() {
      const result = await fetch_api.apiGet(api_user.getAllIdols);
      if(result.success === false) 
            throw new Error(result.error);

      return result.data;
}
async function getIdolById(id) {
      const result = await fetch_api.apiGet(`${api_user.getIdolById}/${id}`);
      if(result.success === false) throw new Error(result.error);
      return result.data;
}
async function getIdolImagePath(id) {
      const idol = await getIdolById(id);
      return idol.avatar_url;
}
const idol_api = {
      GetAllIdols,
      getIdolById,
      getIdolImagePath,
}
export default idol_api;
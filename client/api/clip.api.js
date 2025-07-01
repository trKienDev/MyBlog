import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetAllClips() {
      const response = await fetch_api.apiGet(api_user.getAllClips);
      if(response.success === false) throw new Error(response.error);
      return response.data;
}

const clip_api = {
      GetAllClips,
}
export default clip_api;
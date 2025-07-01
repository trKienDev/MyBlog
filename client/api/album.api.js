import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetAllAlbums() {
      const response = await fetch_api.apiGet(api_user.getAllAlbums);
      if(response.success === false) throw new Error(response.error);
      return response.data;
}

const album_api = {
      GetAllAlbums,
}
export default album_api;
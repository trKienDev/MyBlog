import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetAllMangas() {
      const result = await fetch_api.apiGet(api_user.getAllMangas);
      if(result.success === false) throw new Error(result.error);
      return result.data;
}

async function FindMangaById(id) {
      const result = await fetch_api.apiGet(`${api_user.findMangaById}/${id}`);
      if(result.success === false) throw new Error(result.error);
      return result.data;
}

const manga_api = {
      GetAllMangas,
      FindMangaById,
}
export default manga_api;
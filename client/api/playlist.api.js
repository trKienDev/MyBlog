import api_configs from "./api.config.js";
import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetPlaylists() {
      const result = await fetch_api.apiGet(api_user.getPlaylists);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function getPlaylistById(playlist_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getPlaylistById}/${playlist_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function getPlaylistName(playlist_id) {
      const playlist = await getPlaylistById(playlist_id);
      return playlist.name;
}

const playlist_api = {
      GetPlaylists,
      getPlaylistById,
      getPlaylistName,
};
export default playlist_api;
import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetAllImages() {
      const result = await fetch_api.apiGet(api_user.getAllImages);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

const image_api = {
      GetAllImages,
}
export default image_api;
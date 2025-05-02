import api_configs from "./api.config.js";
import fetch_api from "./fetch.api.js";

async function getCreatorImg(creator_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getCreatorById}/${creator_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data.image;
}

const creator_api = {
      getCreatorImg,
}
export default creator_api;
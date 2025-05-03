import api_configs from "./api.config.js";
import fetch_api from "./fetch.api.js";

async function getCreatorById(creator_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getCreatorById}/${creator_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data;
}

async function getCreatorName(creator_id) {
      const creator = await getCreatorById(creator_id);
      return creator.name;
}

async function getCreatorImg(creator_id) {
      const creator = await getCreatorById(creator_id);
      return creator.image;
}

const creator_api = {
      getCreatorName,
      getCreatorImg,
}
export default creator_api;
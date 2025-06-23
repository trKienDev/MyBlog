import api_configs from "./api.config.js";
import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function getCreators() {
      const result = await fetch_api.apiGet(`${api_user.getCreators}`);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data;
}

async function getCreatorById(creator_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getCreatorById}/${creator_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }
      return result.data;
}
async function GetCreatorsByTagId(tag_id) {
      const result = await fetch_api.apiGet(`${api_user.getCreatorsByTagId}/${tag_id}`);
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
      getCreators,
      getCreatorById,
      getCreatorName,
      getCreatorImg,
      GetCreatorsByTagId,
}
export default creator_api;
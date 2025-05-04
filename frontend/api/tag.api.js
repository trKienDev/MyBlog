import api_configs from './api.config.js';
import fetch_api from './fetch.api.js';

async function getTags() {
      const result = await fetch_api.apiGet(api_configs.endpoints.getTags);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function getTagById(tag_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getTagById}/${tag_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function getTagName(tag_id) {
      const tag = await getTagById(tag_id);
      return tag.name;
}

const tag_api = {
      getTags,
      getTagById,
      getTagName,
};
export default tag_api;



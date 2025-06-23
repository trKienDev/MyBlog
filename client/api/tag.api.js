import api_configs from './api.config.js';
import { api_user } from './endpoint.api.js';
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

async function GetTagsByFilm() {
      const result = await fetch_api.apiGet(api_user.getTagsByFilm);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function GetTagsByVideo() {
      const result = await fetch_api.apiGet(api_user.getTagsByVideo);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function GetTagsByVideoHomepage() {
      const result = await fetch_api.apiGet(api_user.getTagsByVideoHomepage);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

async function GetTagsByCreator() {
      const result = await fetch_api.apiGet(api_user.getTagsByCreator);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}


const tag_api = {
      getTags,
      getTagById,
      getTagName,
      GetTagsByFilm,
      GetTagsByVideo,
      GetTagsByVideoHomepage,
      GetTagsByCreator,
};
export default tag_api;



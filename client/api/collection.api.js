import api_configs from './api.config.js';
import { api_user } from './endpoint.api.js';
import fetch_api from './fetch.api.js';

async function getCollectionById(id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getCollection_byId}/${id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}
async function getCollectionName(id) {
      const collection = await getCollectionById(id);
      return collection.name;
}
async function GetCollections() {
      const result = await fetch_api.apiGet(api_user.getCollections);
      if(result.success === false) {
            throw new Error(result.error);
      }

      return result.data;
}

const collection_api = {
      getCollectionName,
      GetCollections,
};
export default collection_api;

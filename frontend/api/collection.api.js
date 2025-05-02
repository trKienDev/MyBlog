import api_configs from './api.config.js';
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

const collection_api = {
      getCollectionName,
};
export default collection_api;

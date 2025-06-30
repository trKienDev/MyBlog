import { api_user } from "./endpoint.api.js";
import fetch_api from "./fetch.api.js";

async function GetAllRecords() {
      const response = await fetch_api.apiGet(api_user.getAllRecords);
      if(response.success === false) throw new Error('Error getting all records: ', response.error);
      return response.data;
}

const records_api = {
      GetAllRecords,
}
export default records_api;
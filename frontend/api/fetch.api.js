import { ErrorSweetAlert } from "../utils/sweetAlert.js";
import apiConfig from "./api.config.js";

export async function GetList(endpoint) {
      try {
            const response = await fetch(`${apiConfig.server}${endpoint}`);
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const list = await response.json();
            return list;
      } catch(error) {
            console.error('Error api - get list: ', error);
            throw error;
      }
}

export async function CreateItem(endpoint, form) {
      try {
            const response = await fetch(`${apiConfig.server}${endpoint}`, {
                  method: 'POST',
                  body: form
            });

            if(!response.ok) {
                  ErrorSweetAlert("Error in server");
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result;
      } catch(error) {
            throw new Error(`Error in api method: ${error}`);
      }
}

export async function UpdateItem(endpoint, form) {
      try {
            const response = await fetch(`${apiConfig.server}${endpoint}`, {
                  method: 'PUT',
                  body: form
            });
      
            if(!response.ok) {
                  ErrorSweetAlert("Error in server");
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            const result = await response.json();
            return result;
      } catch(error) {
            throw new Error(`Error in api method: ${error}`);
      }
}

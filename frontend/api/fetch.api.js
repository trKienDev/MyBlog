import { ErrorSweetAlert } from "../utils/sweetAlert.js";
import apiConfig from "./api.config.js";

export async function GetList(endpoint) {
      try {
            const response = await fetch(`${apiConfig.server}${endpoint}`);
            if(!response.ok) {
                  const error = await response.json();
                  return { success: false, error: error.message };
            }

            const result = await response.json();
            return { success: true, data: result };
      } catch(error) {
            throw new Error(`Error in GET api: ${error}`);
      }
}

export async function CreateItem(endpoint, form) {
      try {
            const response = await fetch(`${apiConfig.server}${endpoint}`, {
                  method: 'POST',
                  body: form
            });
            if(!response.ok) {
                  const error = await response.json();
                  return { success: false, error: error.message };
            }

            const result = await response.json();
            return { success: true, data: result };
      } catch(error) {
            throw new Error(`Error in api method: ${error}`);
      }
}

export async function CreateItemJson(endpoint, data) {
      try {
            const response = await fetch(`${apiConfig.server}${endpoint}`, {
                  method: 'POST',
                  header: {
                        'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
            });

            if(!response.ok) {
                  const error = await response.json();
                  return { success: false, error: error.message };
            }

            const result = await response.json();
            return { success: true, data: result };
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
                  const error = await response.json();
                  return { success: false, error: error.message };
            }
      
            const result = await response.json();
            return { success: true, data: result };
      } catch(error) {
            throw new Error(`Error in api method: ${error}`);
      }
}

export async function DeleteItem(endpoint) {
      try {
            const response = await fetch(`${apiConfig.server}${endpoint}`, {
                  method: 'DELETE',
            });
      
            if(!response.ok) {
                  const error = await response.json();
                  return { success: false, error: error.message };
            }
            
            const result = await response.json();
            return { success: true, data: result };
      } catch(error) {
            throw new Error(`Error in api method: ${error}`);
      }
}


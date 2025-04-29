import api_configs from "./api.config.js";

async function apiGet(endpoint) {
      try {
            const response = await fetch(`${api_configs.server}${endpoint}`);
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

async function createForm(endpoint, form) {
      try {
            const response = await fetch(`${api_configs.server}${endpoint}`, {
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

async function createJson(endpoint, data) {
      try {
            const response = await fetch(`${api_configs.server}${endpoint}`, {
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

async function updateForm(endpoint, form) {
      try {
            const response = await fetch(`${api_configs.server}${endpoint}`, {
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

async function apiDelete(endpoint) {
      try {
            const response = await fetch(`${api_configs.server}${endpoint}`, {
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

const fetch_api = {
      apiGet,
      createForm,
      createJson,
      updateForm,
      apiDelete,
};
export default fetch_api;
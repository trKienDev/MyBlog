import apiConfig from "./api.config.js";

export async function get(endpoint) {
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

export async function create_form(endpoint, form) {
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

export async function create_json(endpoint, data) {
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

export async function update_form(endpoint, form) {
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

export async function method_delete(endpoint) {
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

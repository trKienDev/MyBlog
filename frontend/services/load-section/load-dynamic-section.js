import api_configs from '../../../api/api.config.js';

function loadContentFromUrl(endpoint, section_element, callback = () => {}) {
      const url = `${api_configs.client}${endpoint}`;
      loadContent(url, section_element, callback);
}

async function loadContent(url, dynamicData_id = 'dynamic-section', callback) {
      try {
            const response = await fetch(url);
            if(!response.ok) {
                  throw new Error(`Failed to fetch page: ${response.status}`);
            }

            const html = await response.text();
            const dynamicData_element = document.getElementById(dynamicData_id);
            if (dynamicData_element) {
                  dynamicData_element.innerHTML = ''; 
                  dynamicData_element.innerHTML = html; 
                  
                  const scripts = dynamicData_element.querySelectorAll('script');
                  scripts.forEach(script => {
                        const new_script = document.createElement('script');
                        new_script.textContent = script.textContent;
                        document.body.appendChild(new_script);
                        document.body.removeChild(new_script);
                  });

                  if (callback && typeof callback === 'function') {
                        callback();
                  }
            } else {
                  console.error(`Element with ID ${dynamicData_id} does not exist`);
            }
      } catch(error) {
            console.error('Error loading content: ', error);
      }
}

const loadDynamicSection_service = {
      loadContentFromUrl,
}
export default loadDynamicSection_service;
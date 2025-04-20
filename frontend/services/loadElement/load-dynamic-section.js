import apiConfig from '../../../api/api.config.js';
import { initTagAdmin } from '../../../admin/tags/tag.js';
import { initCreatorAdmin } from '/admin/creators/creator.js';
import { initStudioAdmin } from '/admin/studios/studio.js';
import { initCodeAdmin } from '/admin/codes/code.js';
import { init_filmAdmin } from '/admin/films/films.js';
import { InitCollectionAdmin } from '/admin/collections/collection.js';

let dynamicLoadingElement = 'dynamic-section';

document.addEventListener("DOMContentLoaded", () => {
      navigateLink('creator-link', apiConfig.endpoints.adminCreatorPage, initCreatorAdmin);
      navigateLink('studio-link', apiConfig.endpoints.adminStudioPage, initStudioAdmin);
      navigateLink('film-link', apiConfig.endpoints.adminFilmPage, init_filmAdmin );
      navigateLink('code-link', apiConfig.endpoints.adminCodePage, initCodeAdmin);
      navigateLink('tag-link', apiConfig.endpoints.adminTagPage, initTagAdmin);
      navigateLink('collection-link', apiConfig.endpoints.adminCollectionPage, InitCollectionAdmin);
});

function navigateLink(linkId, endpoint, callback = () => {}) {
      const linkElement = document.getElementById(linkId);
      if(linkElement) {
            linkElement.addEventListener('click', event => {
                  event.preventDefault();
                  const url = `${apiConfig.client}${endpoint}`;
                  loadContent(url, dynamicLoadingElement, callback);
            });
      } else {
            console.error(`Element with id: "${linkId}" not found`);
      }
}

async function loadContent(url, dynamicDataId = 'dynamic-data', callback) {
      try {
            const response = await fetch(url);
            if(!response.ok) {
                  throw new Error(`Failed to fetch page: ${response.status}`);
            }

            const html = await response.text();
            const dynamicDataElement = document.getElementById(dynamicDataId);
            if (dynamicDataElement) {
                  dynamicDataElement.innerHTML = html; 
                  
                  const scripts = dynamicDataElement.querySelectorAll('script');
                  scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        newScript.textContent = script.textContent;
                        document.body.appendChild(newScript);
                        document.body.removeChild(newScript);
                  });

                  if (callback && typeof callback === 'function') {
                        callback();
                  }
            } else {
                  console.error(`Element with ID ${dynamicDataId} does not exist`);
            }
      } catch(error) {
            console.error('Error loading content: ', error);
      }
}

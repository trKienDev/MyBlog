import apiConfig from '../../../api/api.config.js';
import { initTagAdmin } from '../../../admin/tags/tag.js';
import { initCreatorAdmin } from '/admin/creators/creator.js';
import { initStudioAdmin } from '/admin/studios/studio.js';
import { initCodeAdmin } from '/admin/codes/code.js';
import { init_filmAdmin } from '/admin/films/films.js';
import { InitCollectionAdmin } from '/admin/collections/collection.js';
import { admin_intiVideo } from '/admin/videos/video.js';

let dynamicLoadingElement = 'dynamic-section';

document.addEventListener("DOMContentLoaded", () => {
      navigate_link('creator-link', apiConfig.endpoints.adminCreatorPage, initCreatorAdmin);
      navigate_link('studio-link', apiConfig.endpoints.adminStudioPage, initStudioAdmin);
      navigate_link('film-link', apiConfig.endpoints.adminFilmPage, init_filmAdmin );
      navigate_link('code-link', apiConfig.endpoints.adminCodePage, initCodeAdmin);
      navigate_link('tag-link', apiConfig.endpoints.adminTagPage, initTagAdmin);
      navigate_link('collection-link', apiConfig.endpoints.adminCollectionPage, InitCollectionAdmin);
      navigate_link('video-link', apiConfig.endpoints.admin_videoPage, admin_intiVideo);

});

export function navigate_link(linkId, endpoint, callback = () => {}) {
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

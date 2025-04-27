import api_configs from '../../../api/api.config.js';
import { initTagAdmin } from '../../../admin/tags/tag.js';
import { initCreatorAdmin } from '/admin/creators/creator.js';
import { initStudioAdmin } from '/admin/studios/studio.js';
import { initCodeAdmin } from '/admin/codes/code.js';
import { initFilmAdmin } from '/admin/films/films.js';
import { InitCollectionAdmin } from '/admin/collections/collection.js';
import { initVideoAdmin } from '/admin/videos/video.js';

let dynamicLoadingElement = 'dynamic-section';

document.addEventListener("DOMContentLoaded", () => {
      spaNavigateLink('creator-link', api_configs.endpoints.adminCreatorPage, initCreatorAdmin);
      spaNavigateLink('studio-link', api_configs.endpoints.adminStudioPage, initStudioAdmin);
      spaNavigateLink('film-link', api_configs.endpoints.adminFilmPage, initFilmAdmin );
      spaNavigateLink('code-link', api_configs.endpoints.adminCodePage, initCodeAdmin);
      spaNavigateLink('tag-link', api_configs.endpoints.adminTagPage, initTagAdmin);
      spaNavigateLink('collection-link', api_configs.endpoints.adminCollectionPage, InitCollectionAdmin);
      spaNavigateLink('video-link', api_configs.endpoints.adminVideoPage, initVideoAdmin);
});

export function spaNavigateLink(link_id, endpoint, callback = () => {}) {
      const link_element = document.getElementById(link_id);
      if (link_element) {
            if (!link_element.hasAttribute('data-navigate-initialized')) {
            link_element.addEventListener('click', event => {
                  event.preventDefault();
                  loadContentFromUrl(endpoint, callback);
            });
            link_element.setAttribute('data-navigate-initialized', 'true'); // Đánh dấu đã gán
            }
      } else {
            console.error(`Element with id: "${link_id}" not found`);
      }
}

export function loadContentFromUrl(endpoint, callback = () => {}) {
      const url = `${api_configs.client}${endpoint}`;
      loadContent(url, dynamicLoadingElement, callback);
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
                  dynamicDataElement.innerHTML = ''; 
                  dynamicDataElement.innerHTML = html; 
                  
                  const scripts = dynamicDataElement.querySelectorAll('script');
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
                  console.error(`Element with ID ${dynamicDataId} does not exist`);
            }
      } catch(error) {
            console.error('Error loading content: ', error);
      }
}
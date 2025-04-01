import apiConfig from '../../../api/api.config.js';
import { initTagAdmin } from '../../../admin/tags/tag.js';
import { initCreatorAdmin } from '/admin/creators/creator.js';
import { InitStudioAdmin } from '/admin/studios/studio.js';
import { initCodeAdmin } from '/admin/codes/code.js';

let dynamicLoadingElement = 'dynamic-section';

document.addEventListener("DOMContentLoaded", function() {
      const adminCreatorPageLink = document.querySelector('a[href="/admin/creators"]');
      adminCreatorPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${apiConfig.client}${apiConfig.endpoints.adminCreatorPage}`;
            loadContent(url, dynamicLoadingElement, () => {
                  initCreatorAdmin();
            });
      });

      const adminStudiosPageLink = document.getElementById('studio-link');
      adminStudiosPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${apiConfig.client}${apiConfig.endpoints.adminStudioPage}`;
            loadContent(url, dynamicLoadingElement, () => {
                  InitStudioAdmin();
            });
      });

      const adminCodesPageLink = document.getElementById('code-link');
      adminCodesPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${apiConfig.client}${apiConfig.endpoints.adminCodePage}`;
            loadContent(url, dynamicLoadingElement, () => {
                  initCodeAdmin();
            });
      });

      const adminTagsPageLink = document.getElementById('tag-link');
      adminTagsPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${apiConfig.client}${apiConfig.endpoints.adminTagPage}`;
            loadContent(url, dynamicLoadingElement, () => {
                  initTagAdmin();
            });
      });

});

export function loadContent(url, dynamicDataId = 'dynamic-data', callback) {
      fetch(url)
      .then(response => {
            if (!response.ok) {
                  throw new Error(`Failed to fetch page: ${response.status}`);
            }
            return response.text();
      })
      .then(html => {
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
      })
      .catch(error => {
            console.error('Error loading content:', error);
      });
}

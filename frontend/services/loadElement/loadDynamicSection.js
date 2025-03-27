import api from '../apiConfig.js';
import { initCreatorAdmin } from '/admin/creators/creator.js';
import { InitStudioAdmin } from '/admin/studios/studio.js';

let dynamicLoadingElement = 'dynamic-section';

document.addEventListener("DOMContentLoaded", function() {
      const settingPageLink = document.querySelector('a[href="/admin/pages/setting"]');
      settingPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${api.client}${api.endpoints.settingPage}`;
            loadContent(url, 'dynamic-section', () => {
                  const creatorSettingLink = document.querySelector('a[href="/admin/pages/setting/actress"]');
                  addLinkEventHandler(creatorSettingLink, '/admin/pages/setting/actress/actress.html', loadActressTable);
            });
      });

      const adminCreatorPageLink = document.querySelector('a[href="/admin/creators"]');
      adminCreatorPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${api.client}${api.endpoints.adminCreatorPage}`;
            loadContent(url, dynamicLoadingElement, () => {
                  initCreatorAdmin();
            });
      });

      const adminStudiosPageLink = document.getElementById('studio-link');
      adminStudiosPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${api.client}${api.endpoints.adminStudioPage}`;
            loadContent(url, dynamicLoadingElement, () => {
                  InitStudioAdmin();
            });
      });

});

function addLinkEventHandler(link, url, callback) {
      link.addEventListener('click', function(event) {
            event.preventDefault();
            loadContent(url, dynamicLoadingElement, callback);
      });
}

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

import { initCreatorAdmin } from '/admin/pages/creators/creator.js';
import api from '../apiConfig.js';

let dynamicLoadingElement = 'dynamic-section';

document.addEventListener("DOMContentLoaded", function() {
      const settingPageLink = document.querySelector('a[href="/admin/pages/setting"]');
      settingPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${api.frontendDomain}${api.endpoints.settingPage}`;
            loadContent(url, 'dynamic-section', () => {
                  const creatorSettingLink = document.querySelector('a[href="/admin/pages/setting/actress"]');
                  addLinkEventHandler(creatorSettingLink, '/admin/pages/setting/actress/actress.html', loadActressTable);
            });
      });

      const adminCreatorPageLink = document.querySelector('a[href="/admin/pages/creators"]');
      adminCreatorPageLink.addEventListener('click', function(event) {
            event.preventDefault();
            console.log("hello wolrd");
            const url = `${api.frontendDomain}${api.endpoints.adminCreatorPage}`;
            loadContent(url, dynamicLoadingElement, () => {
                  addLinkEventHandler(adminCreatorPageLink, '/admin/pages/creators/creator.html', initCreatorAdmin);
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
                  dynamicDataElement.innerHTML = html; // Insert the HTML content
                  
                  // Execute scripts inside the loaded HTML
                  const scripts = dynamicDataElement.querySelectorAll('script');
                  scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        newScript.textContent = script.textContent;
                        document.body.appendChild(newScript);
                        document.body.removeChild(newScript);
                  });

                  // Optional callback after content is loaded (e.g., to load more specific logic)
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

function addLinkEventHandler(link, url, callback) {
      link.addEventListener('click', function(event) {
            event.preventDefault();
            loadContent(url, dynamicLoadingElement, callback);
      });
}
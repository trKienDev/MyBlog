import config from '../config.js';
import { loadSidebarTable } from '../../pages/setting/sidebar/sidebar.js';
import { loadActressTable } from '../../pages/setting/actress/actress.js';
import { loadStudioTable } from '../../pages/setting/studio/studio.js';
import { loadTagsTable } from '../../pages/setting/tags/tags.js';
import { loadFilm } from '../../pages/setting/films/films.js';
import { loadStory } from '../../pages/setting/story/story.js';

document.addEventListener("DOMContentLoaded", function() {
      const settingsLink = document.querySelector('a[href="/admin/pages/setting"]');
      settingsLink.addEventListener('click', function(event) {
            event.preventDefault();
            const url = `${config.frontendDomain}${config.endpoints.settingPage}`;
            updateURL('settings');
            loadContent(url, 'dynamic-data', setupSettingPageLinks);
      });
});

function setupSettingPageLinks() {
      addLinkEventHandler('a[href="/admin/pages/setting/sidebar"]', '/admin/pages/setting/sidebar/sidebar.html', loadSidebarTable, 'settings/sidebar');
      addLinkEventHandler('a[href="/admin/pages/setting/actress"]', '/admin/pages/setting/actress/actress.html', loadActressTable, 'settings/actress');
      addLinkEventHandler('a[href="/admin/pages/setting/studio"]', '/admin/pages/setting/studio/studio.html', loadStudioTable, 'setting/studio');
      addLinkEventHandler('a[href="/admin/pages/setting/tags"]', '/admin/pages/setting/tags/tags.html', loadTagsTable, 'settings/tag');
      addLinkEventHandler('a[href="/admin/pages/setting/films"]', '/admin/pages/setting/films/films.html', loadFilm, 'settings/film');
      addLinkEventHandler('a[href="/admin/pages/setting/story"]', '/admin/pages/setting/story/story.html', loadStory, 'settings/story');
}

function addLinkEventHandler(selector, url, callback, updateUrl) {
      const link = document.querySelector(selector);
      if (link) {
            link.addEventListener('click', function(event) {
                  event.preventDefault();
                  updateURL(updateUrl);
                  loadContent(url, 'dynamic-data', callback);
            });
      }
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

function updateURL(path) {
      history.pushState({}, '', path);
}

window.addEventListener('popstate', function() {
    // Reload the correct content when user navigates back/forward
    loadContent(location.pathname, 'dynamic-data', setupSettingPageLinks);
});

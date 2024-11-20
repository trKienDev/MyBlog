import config from '../config.js';
import { loadSidebarTable } from '../../pages/setting/sidebar/sidebar.js';
import { loadActressTable } from '../../pages/setting/actress/actress.js';
import { loadStudioTable } from '../../pages/setting/studio/studio.js';
import { loadTagsTable } from '../../pages/setting/tags/tags.js';
import { loadFilm } from '../../pages/setting/films/films.js';

// Load ActressTable
document.addEventListener("DOMContentLoaded", function() {
    // Event listener đã có cho trang setting
    const settingsLink = document.querySelector('a[href="/admin/pages/setting"]');
    settingsLink.addEventListener('click', function(event) {
        event.preventDefault();
        // Sử dụng config để cấu hình URL
        const url = `${config.frontendDomain}${config.endpoints.settingPage}`;
        loadContent(url, 'dynamic-data', () => {
            const sidebarLink = document.querySelector('a[href="/admin/pages/setting/sidebar"]');
            addLinkEventHandler(sidebarLink, '/admin/pages/setting/sidebar/sidebar.html', loadSidebarTable);

            const actressLink = document.querySelector('a[href="/admin/pages/setting/actress"]');
            addLinkEventHandler(actressLink, '/admin/pages/setting/actress/actress.html', loadActressTable);

            const studioLink = document.querySelector('a[href="/admin/pages/setting/studio"]');
            addLinkEventHandler(studioLink, '/admin/pages/setting/studio/studio.html', loadStudioTable);

            const tagLink = document.querySelector('a[href="/admin/pages/setting/tags"]');
            addLinkEventHandler(tagLink, '/admin/pages/setting/tags/tags.html', loadTagsTable);

            const filmLink = document.querySelector('a[href="/admin/pages/setting/films"]');
            addLinkEventHandler(filmLink, '/admin/pages/setting/films/films.html', loadFilm);


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
        loadContent(url, 'dynamic-data', callback);
    });
}
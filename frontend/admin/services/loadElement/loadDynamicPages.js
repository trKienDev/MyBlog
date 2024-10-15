import config from '../config.js';
import { loadSidebarTable } from '../../pages/setting/sidebar/sidebar.js';

document.addEventListener("DOMContentLoaded", function() {
    // Event listener đã có cho trang setting
    const settingsLink = document.querySelector('a[href="/admin/pages/setting"]');
    settingsLink.addEventListener('click', function(event) {
        event.preventDefault();
        // Sử dụng config để cấu hình URL
        const url = `${config.frontendDomain}${config.endpoints.settingPage}`;
        loadContent(url, 'dynamic-data', () => {
            const menuLink = document.querySelector('a[href="/admin/pages/setting/sidebar"]');
            if (menuLink) {
                menuLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    const menuUrl = '/admin/pages/setting/sidebar/sidebar.html';
                    loadContent(menuUrl, 'dynamic-data', loadSidebarTable);
                });
            }
        });
    });
});

function loadContent(url, dynamicDataId = 'dynamic-data', callback) {
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


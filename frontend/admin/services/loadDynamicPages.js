import config from './config.js';

document.addEventListener("DOMContentLoaded", function() {
    const settingsLink = document.querySelector('a[href="/admin/pages/setting"]');

    settingsLink.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Sử dụng config để cấu hình URL
        const url = `${config.frontendDomain}${config.endpoints.settingPage}`;
        loadContent(url);
    });

    function loadContent(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch page: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const dynamicDataElement = document.getElementById('dynamic-data');
                dynamicDataElement.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading content', error);
            });
    }
});

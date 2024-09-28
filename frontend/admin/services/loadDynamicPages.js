import config from './config.js';

document.addEventListener("DOMContentLoaded", function() {
    // Event listener đã có cho trang setting
    const settingsLink = document.querySelector('a[href="/admin/pages/setting"]');
    settingsLink.addEventListener('click', function(event) {
        event.preventDefault();
        // Sử dụng config để cấu hình URL
        const url = `${config.frontendDomain}${config.endpoints.settingPage}`;
        loadContent(url);
    });

    // Load dynamic data
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
                if(dynamicDataElement) {
                    dynamicDataElement.innerHTML = html;// Chèn nội dung HTML vào thẻ div
                    // Tìm thẻ <a> mới được chèn vào với href="/admin/pages/setting/menu"
                    const menuLink = dynamicDataElement.querySelector('a[href="/admin/pages/setting/menu"]');
                    if (menuLink) {
                        menuLink.addEventListener('click', function(event) {
                            event.preventDefault();
                            const menuUrl = '/admin/pages/setting/menu.html';  // URL của trang menu
                            loadContent(menuUrl);  // Gọi lại hàm loadContent để tải nội dung động của menu.html
                        });
                    }
                } else {
                    console.error('Element dynamic-data không tồn tại');
                }
            })
            .catch(error => {
                console.error('Error loading content', error);
            });
    }
});

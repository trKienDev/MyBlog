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
                    // Thực thi các script bên trong nội dung được chèn vào
                    const scripts = dynamicDataElement.querySelectorAll('script');
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        newScript.textContent = script.textContent;  // Sao chép nội dung của script
                        document.body.appendChild(newScript);  // Thêm script vào DOM để thực thi
                        document.body.removeChild(newScript);  // Xóa script sau khi thực thi để giữ DOM sạch
                    });
                    // Tìm thẻ <a> mới được chèn vào với href="/admin/pages/setting/menu"
                    const menuLink = dynamicDataElement.querySelector('a[href="/admin/pages/setting/sidebar"]');
                    if (menuLink) {
                        menuLink.addEventListener('click', function(event) {
                            event.preventDefault();
                            const menuUrl = '/admin/pages/setting/sidebar.html';  // URL của trang menu
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

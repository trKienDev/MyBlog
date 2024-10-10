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
                            loadSidebar();
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

    // Load sidebar-item
    function loadSidebar() {
        fetch('http://localhost:3000/admin/sidebar')
                .then(response => {
                        if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // Chuyển đổi phản hồi sang JSON
                })
                .then(sidebarItems => {
                        // Lấy tbody của bảng để chèn các hàng mới
                        const tbody = document.querySelector('#sidebar-table tbody');
                        tbody.innerHTML = ''; // Xóa nội dung cũ (nếu có)
    
                        sidebarItems.forEach(item => {
                                // Tạo một hàng mới
                                const row = document.createElement('tr');
                                row.setAttribute('data-id', item._id);
                                // Tạo các cột và gán nội dung tương ứng
                                // Cột checkbox
                                const tdCheckbox = document.createElement('td');
                                tdCheckbox.classList.add('td_checkbox');
                                tdCheckbox.innerHTML = `
                                <span>
                                        <input type="checkbox" id="checkbox${item.id}">
                                        <label for="checkbox${item.id}"></label>
                                </span>`;
                                
                                // Cột icon
                                const tdIcon = document.createElement('td');
                                tdIcon.classList.add('td_icon');
                                tdIcon.innerHTML = `<i class="${item.icon}"></i>`; // Gán item.icon vào thẻ <i>
    
                                // Cột tên
                                const tdName = document.createElement('td');
                                tdName.classList.add('td_name');
                                tdName.innerHTML = `<span>${item.name}</span>`;
    
                                // Cột action (sửa/xóa)
                                const tdAction = document.createElement('td');
                                tdAction.classList.add('td_action');
                                tdAction.innerHTML = `
                                                                <div class="btn btn-del">
                                                                        <a href="#" data-id="${item._id}">
                                                                                <i class="fa-solid fa-trash"></i>
                                                                        </a>
                                                                </div>`;

                                // Thêm các cột vào hàng
                                row.appendChild(tdCheckbox);
                                row.appendChild(tdIcon);
                                row.appendChild(tdName);
                                row.appendChild(tdAction);
    
                                // Thêm hàng vào tbody
                                tbody.appendChild(row);

                                // Thêm event listener cho nút xóa
                                const deleteButton = tdAction.querySelector('.btn-del a');
                                deleteButton.addEventListener('click', function(event) {
                                    event.preventDefault(); // Ngăn hành động mặc định của thẻ <a>
                                    const itemId = deleteButton.getAttribute('data-id'); // Lấy item._id từ thuộc tính data-id
                                    // Gọi hàm deleteSidebarItem trong apiService.js và truyền ID
                                    deleteSidebarItem(itemId);
                                });
                        });
                })
                .catch(error => {
                        console.error('Error fetching data', error);
                });
    }

    // Hàm để xóa sidebar item
    function deleteSidebarItem(id) {
        // URL API xóa item với ID truyền vào
        const apiUrl = `http://localhost:3000/admin/sidebar/delete/${id}`;
        fetch(apiUrl, {
                method: 'DELETE', // Sử dụng phương thức DELETE
                headers: {
                        'Content-Type': 'application/json' // Thiết lập header cho request
                }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
                // Tìm dòng chứa item vừa xóa và xóa nó khỏi bảng
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                    row.remove(); // Xóa dòng khỏi bảng
                }
                console.log("Sidebar item deleted successfully:", data);
        })
        .catch(error => {
            console.error("Error deleting sidebar item:", error);
        });
    }

});


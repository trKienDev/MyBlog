import config from './config.js';

// Load trang admin: gọi 2 api adminPage và sidebarList
Promise.all([
        fetch(`${config.domain}${config.endpoints.adminPage}`),
        fetch(`${config.domain}${config.endpoints.sidebarList}`)
])
.then(response => {
        // Kiểm tra xem cả 2 phản hồi có thành công ?
        const [adminPageResponse, sidebarListResponse] = response;
        if(!adminPageResponse.ok) {
                throw new Error(`HTTP error! Status: ${adminPageResponse.status}`);
        }
        if(!sidebarListResponse.ok) {
                throw new Error(`HTTP error! Status: ${sidebarListResponse.status}`);
        }
        // Trả về kết quả JSON của cả 2
        return Promise.all([adminPageResponse.json(), sidebarListResponse.json()]);
})
.then(([adminPageData, sidebarItems]) => {
        // Xử lý dữ liệu từ adminPage
        // ................................................

        // Render sidebar items ra giao diện
        const menuList = document.getElementById('sidebar-list');
        
        sidebarItems.forEach(item => {
                console.log(item);
                const menuItem = document.createElement('div');
                menuItem.classList.add('sidebar-item');

                const menuItemIcon = document.createElement('div');
                menuItemIcon.classList.add('sidebar-item-icon');
                const iconElement = document.createElement('i');
                iconElement.className = item.icon; // gán class icon từ API
                menuItemIcon.appendChild(iconElement);

                const menuItemName = document.createElement('div');
                menuItemName.classList.add('sidebar-item-name');
                const nameElement = document.createElement('span');
                nameElement.textContent = item.name;
                menuItemName.appendChild(nameElement);

                menuItem.appendChild(menuItemIcon);
                menuItem.appendChild(menuItemName);

                menuList.appendChild(menuItem);
        });
})
.catch(error => {
        console.error('Error fetching data', error);
})


LOAD ADMIN PAGE - LOAD

**Question**: khi user truy cập vào "config.endpoints.adminPage" thì sẽ gọi thêm "config.endpoints.sidebarList" để truy vấn danh sách các menu-item và render ra giao diện. theo bạn, yêu cầu này có khả thi không?  có cách nào khác tối ưu hơn không  ?

**Soluton**:

# Yêu cầu
 Bạn muốn khi người dùng truy cập vào API config endpoints.adminPage, ngoài việc xử lý dữ liệu trả về từ adminPage, bạn cũng muốn gọi API thứ hai (config endpoints.sidebarList) để lấy danh sách các menu-item và render ra giao diện.

# Đánh giá yêu cầu
## Khả thi
Điều này hoàn toàn khả thi. Bạn có thể gọi API config endpoints.sidebarList ngay sau khi hoàn thành việc xử lý API config.endpoints.adminPage.
## Phương án tối ưu
Có thể tối ưu bằng cách gọi đồng thời cả hai API thay vì gọi chúng tuần tự. Bằng cách này, bạn có thể giảm thời gian chờ cho các yêu cầu API. Thông qua Promise.all(), bạn có thể thực hiện cả hai yêu cầu cùng lúc và xử lý kết quả đồng thời.

# 2 phương án để triển khai
## Phương án 1: Gọi tuần tự
Cách này là gọi API thứ nhất (adminPage) trước, sau đó mới gọi API thứ hai (sidebarList).

import config from './config.js';

// Gọi API adminPage
fetch(`${config.domain}${config.endpoints.adminPage}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Admin page data:', data);

        // Sau khi xử lý adminPage, gọi thêm API sidebarList
        return fetch(`${config.domain}${config.endpoints.sidebarList}`);
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(sidebarItems => {
        // Xử lý dữ liệu sidebarItems và render ra giao diện
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = ''; // Xóa nội dung cũ
        
        sidebarItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');

            const menuItemIcon = document.createElement('div');
            menuItemIcon.classList.add('menu-item-icon');
            const iconElement = document.createElement('i');
            iconElement.className = item.icon; // Gán class icon từ API
            menuItemIcon.appendChild(iconElement);

            const menuItemName = document.createElement('div');
            menuItemName.classList.add('menu-item-name');
            const nameElement = document.createElement('span');
            nameElement.textContent = item.name; // Gán tên từ API
            menuItemName.appendChild(nameElement);

            menuItem.appendChild(menuItemIcon);
            menuItem.appendChild(menuItemName);

            menuList.appendChild(menuItem);
        });
    })
    .catch(error => {
        console.error('Error fetching data', error);
    });

## Phương án 2: Gọi đồng thời (tối ưu hơn)
Sử dụng Promise.all() để gọi đồng thời cả hai API (adminPage và sidebarList). Điều này sẽ giảm thời gian chờ đợi, vì hai yêu cầu sẽ được thực hiện cùng một lúc.

import config from './config.js';

// Gọi cả hai API đồng thời
Promise.all([
    fetch(`${config.domain}${config.endpoints.adminPage}`),
    fetch(`${config.domain}${config.endpoints.sidebarList}`)
])
    .then(responses => {
        // Kiểm tra xem cả hai phản hồi có thành công không
        const [adminPageResponse, sidebarListResponse] = responses;

        if (!adminPageResponse.ok) {
            throw new Error(`HTTP error! Status: ${adminPageResponse.status}`);
        }
        if (!sidebarListResponse.ok) {
            throw new Error(`HTTP error! Status: ${sidebarListResponse.status}`);
        }

        // Trả về kết quả JSON của cả hai
        return Promise.all([adminPageResponse.json(), sidebarListResponse.json()]);
    })
    .then(([adminPageData, sidebarItems]) => {
        // Xử lý dữ liệu từ adminPage (nếu cần)
        console.log('Admin page data:', adminPageData);

        // Render sidebar items ra giao diện
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = ''; // Xóa nội dung cũ
        
        sidebarItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');

            const menuItemIcon = document.createElement('div');
            menuItemIcon.classList.add('menu-item-icon');
            const iconElement = document.createElement('i');
            iconElement.className = item.icon; // Gán class icon từ API
            menuItemIcon.appendChild(iconElement);

            const menuItemName = document.createElement('div');
            menuItemName.classList.add('menu-item-name');
            const nameElement = document.createElement('span');
            nameElement.textContent = item.name; // Gán tên từ API
            menuItemName.appendChild(nameElement);

            menuItem.appendChild(menuItemIcon);
            menuItem.appendChild(menuItemName);

            menuList.appendChild(menuItem);
        });
    })
    .catch(error => {
        console.error('Error fetching data', error);
    });

# 3. Sự khác biệt giữa 2 phương án
## Phương án 1 (tuần tự)
- Gọi API adminPage, sau đó mới gọi API sidebarList.
- Thời gian thực hiện sẽ lâu hơn vì phải chờ kết quả của API đầu tiên mới gọi API tiếp theo.
## Phương án 2 (đồng thời)
- Gọi đồng thời cả hai API bằng Promise.all(), giúp giảm thời gian chờ đợi.
- Tối ưu hơn khi cả hai API có thể được xử lý song song.
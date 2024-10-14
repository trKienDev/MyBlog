import config2 from "../../../services/config.js";

// Load sidebar-item
export function loadSidebar() {
        fetch(`${config2.domain}${config2.endpoints.sidebarList}`) 
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
                        document.getElementById('sidebar-form')
                                        .addEventListener('submit', function(event) {
                                event.preventDefault();
                                const icon = document.getElementById('sidebar-icon').value;
                                const name = document.getElementById('sidebar-name').value;
                                createSidebar(icon, name);
                        })
                })
                .catch(error => {
                        console.error('Error fetching data', error);
                });
}

// Hàm để xóa sidebar item
function deleteSidebarItem(id) {
        // URL API xóa item với ID truyền vào
        const apiUrl = `${config2.domain}${config2.endpoints.sidebarDelete}/${id}`;
        console.log(apiUrl);
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
                // location.reload();
                console.log("Sidebar item deleted successfully:", data);
        })
        .catch(error => {
            console.error("Error deleting sidebar item:", error);
        });
}

// Hàm thêm 1 sidebar item
async function createSidebar(icon, name) {
        // Chuẩn bị dữ liệu để gửi trong phần body của request
        const requestData = {
                icon: icon,
                name: name
        };
        try {
                // Gửi yêu cầu POST đén endpoint API
                const response = await fetch('http://localhost:3000/admin/sidebar/create', {
                        method: 'POST',
                        headers: {
                                'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify(requestData)
                });
                if(response.ok) {
                        alert('Warning: Website must be reload');
                        location.reload();
                } else {
                        const errorData = await response.json();
                        alert(`Error creating sidebar item: ${errorData.message}`);
                } 
        } catch(error) {
                alert(`Network error: ${error.message}`);
        }            
}

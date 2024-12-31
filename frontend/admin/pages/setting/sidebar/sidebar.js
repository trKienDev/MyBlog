import config2 from "../../../services/config.js";
import { errorSweetAlert, successSweetAlert } from "../../../services/HelperFunction/sweetAlert.js";
import { RenderSidebar } from "../../../services/loadElement/loadSidebar.js";

// Load sidebar-item
export function loadSidebarTable() {
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
                        tdIcon.classList.add('td_icon', 'editable-icon');
                        tdIcon.innerHTML = `<i contenteditable="true" class="${item.icon}"></i>`; // Gán item.icon vào thẻ <i>

                        // Cột tên
                        const tdName = document.createElement('td');
                        tdName.classList.add('td_name', 'editable-name');
                        tdName.innerHTML = `<span contenteditable="true">${item.name}</span>`;

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

                // Create sidebar item
                document.getElementById('sidebar-form').addEventListener('submit', function(event) {
                        event.preventDefault();
                        const icon = document.getElementById('sidebar-icon').value;
                        const name = document.getElementById('sidebar-name').value;
                        createSidebar(icon, name);
                });

                // Edit sidebar item
                document.getElementById('btn-save').addEventListener('click', function() { 
                        updateSidebarItem();
                });
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
                successSweetAlert("Sidebar added")
                .then((result) => {
                        if (result.isConfirmed) {
                               RenderSidebar();
                        }
                });
        })
        .catch(error => {
                errorSweetAlert("Error in frontend");
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

        // reset information in form
        document.getElementById('sidebar-icon').value = '';
        document.getElementById('sidebar-name').value = '';

        try {
                // Gửi yêu cầu POST đén endpoint API
                const response = await fetch(`${config2.domain}${config2.endpoints.sidebarCreate}`, {
                        method: 'POST',
                        headers: {
                                'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify(requestData)
                });

                if ( response.ok ) {
                        Swal.fire ({
                                title : 'Success !' ,
                                text : 'New sidebar item successfully added !',
                                icon : 'Success',
                                confirmButtonText : 'OK',
                                confirmButtonColor: '#218838',
                        }).then(( result ) => {
                                if ( result.isConfirmed ) {
                                        loadSidebarTable();
                                        RenderSidebar();
                                }
                        });
                } else {
                        errorSweetAlert("Error in backend");
                        const errorData = await response.json();
                        alert(`Error creating sidebar item: ${errorData.message}`);
                } 
        } catch(error) {
                alert(`Network error: ${error.message}`);
        }            
}

// Update sidebar item
function updateSidebarItem() {
        const flag = true;
        const rows = document.querySelectorAll('tbody tr');
        const checkedRows = [];

        rows.forEach( row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                        checkedRows.push(row);
                }
        });
        
        if (checkedRows.length === 0) {
                alert("You must check the box to update an item !");
                location.reload();
        }

        // Tạo danh sách các sidebarItem cần cập nhật
        const updateSidebarItems = [];

        checkedRows.forEach(row => {
                const id = row.getAttribute('data-id');
                const icon = row.querySelector('.editable-icon i').className.trim();
                const name = row.querySelector('.editable-name').textContent.trim();
                console.log(id, icon, name);
                updateSidebarItems.push({ id, icon, name });
        });

        // Gửi yêu cầu PUT đến API để cập nhật
        updateSidebarItems.forEach(item => {
                fetch(`${config2.domain}${config2.endpoints.sidebarUpdate}/${id}`, {
                        method: 'PUT',
                        headers: {
                                'Content-Type' : 'application/json',
                        },
                        body : JSON.stringify({
                                icon: item.icon,
                                name: item.name
                        })
                })
                .then(response => response.json())
                .then(data => {
                        if(data.Message === 'Sidebar item updated') {
                                (`Sidebar item ${item.id} updated successfully`);
                        } else {
                                console.error(`Failed to update sidebar item ${item.id}`);
                        }
                })
                .catch(error => {
                        flag = false;
                        console.error('Error updating sidebar items: ', error);
                });
        });

        if (flag === true) {
                alert("The browser must be reloaded to update information !");
                location.reload();
        }
}
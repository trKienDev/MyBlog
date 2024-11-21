import config2 from "../../../services/config.js";
import { setupModalHandlers } from "../../../services/HelperFunction/modal.js";
import { handleImageUpload } from "../../../services/HelperFunction/image.js";
import { loadStudios } from '../../../services/loadElement/loadStudios.js';

export function loadActressTable() {
        fetch(`${config2.domain}${config2.endpoints.actressList}`) 
        .then(response => {
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(actressList => {
                const tbody = document.querySelector('#actress-table tbody');
                tbody.innerHTML = ''; // Xóa nội dung cũ (nếu có)

                actressList.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.setAttribute('data-id', item._id);

                        // Edit button cell
                        const editCell = document.createElement('td');
                        const editContainer = document.createElement('div');
                        editContainer.classList.add('edit-container');
                        editContainer.style.width = '100%'; // Full width of the cell
                        editContainer.style.display = 'flex';
                        editContainer.style.justifyContent = 'center';
                        const editButton = document.createElement('div');
                        editButton.classList.add('btn-edit');
                        editButton.innerHTML = `<i class="fa-solid fa-pen" style="color: aliceblue;"></i>`;
                        editButton.onclick = () => handleEdit(item); // function to handle edit action
                        editCell.appendChild(editButton);
                        editContainer.appendChild(editButton);
                        editCell.appendChild(editContainer);
                        tr.appendChild(editCell);

                        // Name cell
                        const nameCell = document.createElement('td');
                        nameCell.textContent = item.name;
                        tr.appendChild(nameCell);

                        // Image cell
                        const imageCell = document.createElement('td');
                        const image = document.createElement('img');
                        // image.src = item.image || '/admin/static/images/face/profile-default.jpg'; // Fallback image if URL is missing
                        image.src = `${config2.domain}/uploads/actress/avatar/${item.image}`
                        image.classList.add('profile');
                        imageCell.appendChild(image);
                        tr.appendChild(imageCell);
                        
                        // Body cell
                        const bodyCell = document.createElement('td');
                        bodyCell.textContent = item.body || '';
                        tr.appendChild(bodyCell);

                        // Breast cell
                        const breastCell = document.createElement('td');
                        breastCell.textContent = item.breast || '';
                        tr.appendChild(breastCell);

                        // Studio cell
                        const studioCell = document.createElement('td');
                        studioCell.textContent = item.studio ? item.studio.name : ''; 
                        tr.appendChild(studioCell);

                        // Films cell
                        const filmsCell = document.createElement('td');
                        filmsCell.textContent = item.skin || ''; // Assuming `films` is a field in the fetched data
                        tr.appendChild(filmsCell);

                        // Delete button cell
                        const deleteCell = document.createElement('td');
                        const deleteContainer = document.createElement('div');
                        const deleteButton = document.createElement('div');
                        deleteButton.classList.add('btn-delete');
                        deleteButton.innerHTML = `<i class="fa-solid fa-trash" style="color: aliceblue;"></i>`;
                        deleteButton.onclick = () => handleDelete(item._id); // function to handle delete action
                        deleteCell.appendChild(deleteButton);
                        tr.appendChild(deleteCell);

                        // Append the row to the table body
                        tbody.appendChild(tr);                        
                });
        })
        .catch(error => {
                console.error('Error fetching actress data: ', error);
        });

        loadStudios("actress-studio");
        setupModalHandlers("openModalButton", "closeModalButton", "actressModal"); // open modal
        handleImageUpload("profile-image", "image-upload"); // setup image upload logic
        createNewActress("actressForm", "actressModal"); // submit form
}

async function createNewActress(formId, modalId) {
        const actressForm = document.getElementById(formId);
        const actressModal = document.getElementById(modalId);
        const imageUploadInput = document.getElementById("image-upload"); 
        const profileImage = document.getElementById("profile-image"); 
       
        actressForm.onsubmit = async (event) => {
                event.preventDefault(); 
                const formData = new FormData(actressForm);
                console.log(formData);
                try {
                        const response = await fetch(`${config2.domain}${config2.endpoints.actressCreate}`, {
                                method: 'POST',
                                body: formData 
                        });
                        
                        // Lỗi - nữ diễn viên đã tồn tại
                        if (response.status === 409) {
                                const result = await response.json(); 
                                Swal.fire({
                                        title: 'Error!',
                                        text: result.message || 'An error occurred while creating actress.',
                                        icon: 'error',
                                        confirmButtonText: 'OK',
                                });
                                return;
                        }

                        if (response.status !== 201) {
                                console.error('Failed to create actress. HTTP Status:', response.status);
                                console.error('Error: ', response);
                                Swal.fire({
                                        title: 'Error!',
                                        text: 'An error occurred while creating actress. Please try again.',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                });         
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const createdActress = await response.json();

                        if (createdActress._id) {
                                console.log('Actress created successfully:', createdActress);
                                Swal.fire({
                                        title: 'Success!',
                                        text: 'Actress created successfully!',
                                        icon: 'success',
                                        confirmButtonTest: 'OK'
                                });
                        } else {
                                console.error('Invalid response from server:', createdActress);
                                Swal.fire({
                                        title: 'Error!',
                                        text: 'Failed to create actress. Please try again.',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                });                            
                                throw new Error('Failed to create actress. Invalid response from server.');
                        }

                        loadActressTable(); // Gọi lại hàm loadActressTable để cập nhật bảng
                } catch (error) {
                        console.error('Error creating actress in frontend: ', error.message );
                        Swal.fire({
                                title: 'Error!',
                                text: 'An error occurred while creating actress. Please try again.',
                                icon: 'error',
                                confirmButtonText: 'OK'
                        });                        
                } finally {
                        actressForm.reset();
                        if(imageUploadInput) { // Reset giá trị của input file
                                imageUploadInput.value = ""; 
                        }
                        if (profileImage) {
                                profileImage.src = "/admin/static/images/face/upload-profile.jpg"; // Đặt ảnh mặc định
                        }
                        actressModal.style.display = "none";
                }
        };
}

async function handleEdit(actress) {
        const actressModal = document.getElementById("actressModal");
        const actressForm = document.getElementById("actressForm");
        const profileImage = document.getElementById("profile-image");
        const imageUploadInput = document.getElementById("image-upload");

        actressModal.style.display = "block";
        // Điền dữ liệu vào form
        document.getElementById("actress-name").value = actress.name || "";
        document.getElementById("actress-birth").value = actress.birth
                                                                                        ? new Date(actress.birth).toISOString().split("T")[0] : "";
        document.getElementById("actress-skin").value = actress.skin || "";
        await loadStudios();
        document.getElementById("actress-studio").value = actress.studio?._id || "";
        document.getElementById("actress-breast").value = actress.breast || "";
        document.getElementById("actress-body").value = actress.body || "";
        profileImage.src = actress.image
                                                ? `${config2.domain}/uploads/actress/avatar/${actress.image}`
                                                : "/admin/static/images/face/upload-profile.jpg";
        // Xử lý submit form
        actressForm.onsubmit = async (event) => {
                event.preventDefault(); // Ngăn chặn hành vi mặc định của form

                const formData = new FormData(actressForm);
                console.log(formData);
                try {
                        // Gửi yêu cầu cập nhật tới API
                        const response = await fetch(
                                `${config2.domain}${config2.endpoints.actressUpdate}/${actress._id}`, {
                                        method: "PUT",
                                        body: formData,
                                }
                        );

                        if (!response.ok) {
                                Swal.fire({
                                        title: "Error!",
                                        text: "An error occurred while updating actress.",
                                        icon: "error",
                                        confirmButtonText: "OK",
                                });
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const updatedActress = await response.json();

                        // Hiển thị thông báo thành công
                        Swal.fire({
                                title: "Success!",
                                text: "Actress updated successfully!",
                                icon: "success",
                                confirmButtonText: "OK",
                        });

                        // Tải lại bảng dữ liệu
                        loadActressTable();

                        // Đóng modal và reset form
                        actressModal.style.display = "none";
                        actressForm.reset();
                        imageUploadInput.value = ""; // Reset giá trị của input file
                        profileImage.src = "/admin/static/images/face/upload-profile.jpg"; // Đặt ảnh mặc định
                } catch (error) {
                        console.error("Error updating actress in frontend:", error.message);
                        Swal.fire({
                                title: "Error!",
                                text: "An error occurred while updating actress.",
                                icon: "error",
                                confirmButtonText: "OK",
                        });
                }
                
        };
}

async function handleDelete(actressId) {
        // Hiển thị thông báo xác nhận
        const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
        });
    
        if (result.isConfirmed) {
                try {
                        // Gửi yêu cầu DELETE tới API
                        const response = await fetch(`${config2.domain}${config2.endpoints.actressDelete}/${actressId}`, {
                                method: 'DELETE',
                        });

                        if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const data = await response.json();

                        // Hiển thị thông báo thành công
                        Swal.fire(
                                'Deleted!',
                                'Actress has been deleted.',
                                'success'
                        );

                        // Gọi lại loadActressTable để cập nhật bảng
                        loadActressTable();
                } catch (error) {
                        console.error('Error deleting actress:', error);
                        Swal.fire({
                                title: 'Error!',
                                text: 'An error occurred while deleting the actress.',
                                icon: 'error',
                                confirmButtonText: 'OK',
                        });
                }
        }
}
    




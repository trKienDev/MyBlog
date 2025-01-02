import config2 from "../../../services/config.js";
import { setupModalHandlers } from "../../../services/module/modal.js";
import { handleImageUpload } from "../../../services/module/image.js";
import { loadStudios } from '../../../services/loadElement/loadStudios.js';
import { createEditButtonCell, createTdTextCell, createImageCell, createDeleteButtonCell } from "../../../services/module/HTMLHandler.js";
import { errorSweetAlert, successSweetAlert } from "../../../services/module/sweetAlert.js";

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
                        const editCell = createEditButtonCell('edit-container', item, handleEdit);
                        tr.appendChild(editCell);

                        // Name cell
                        const nameCell = createTdTextCell(item.name);
                        tr.appendChild(nameCell);

                        // Image cell
                        const imageSrc = `${config2.domain}/uploads/actress/avatar/${item.image}`
                        const imageCell = createImageCell(imageSrc, 'profile');
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
                        const deleteCell = createDeleteButtonCell(item._id, 'btn-delete', handleDelete);
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

                try {
                        const response = await fetch(`${config2.domain}${config2.endpoints.actressCreate}`, {
                                method: 'POST',
                                body: formData 
                        });
                        
                        // Lỗi - nữ diễn viên đã tồn tại
                        if (response.status === 409) {
                                const result = await response.json(); 
                                const message = result.message || 'An error occurred while creating actress.';
                                errorSweetAlert(message);
                                return;
                        }

                        if (response.status !== 201) {
                                console.error('Failed to create actress. HTTP Status:', response.status);
                                console.error('Error: ', response);
                                errorSweetAlert('Error in backend');    
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const createdActress = await response.json();

                        if (createdActress._id) {
                                console.log('Actress is created successfully:', createdActress);
                                successSweetAlert('Actress created successfully!');
                        } else {
                                console.error('Invalid response from server:', createdActress);
                                errorSweetAlert('Error in backend.');                      
                                throw new Error('Failed to create actress. Invalid response from server.');
                        }

                        loadActressTable(); // Gọi lại hàm loadActressTable để cập nhật bảng
                } catch (error) {
                        console.error('Error creating actress in frontend: ', error.message );
                        errorSweetAlert('Error in frontend');                
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
                                errorSweetAlert('error in backend');
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const updatedActress = await response.json();

                        // Hiển thị thông báo thành công
                        successSweetAlert("Actress updated successfully!");

                        // Tải lại bảng dữ liệu
                        loadActressTable();

                        // Đóng modal và reset form
                        actressModal.style.display = "none";
                        actressForm.reset();
                        imageUploadInput.value = ""; // Reset giá trị của input file
                        profileImage.src = "/admin/static/images/face/upload-profile.jpg"; // Đặt ảnh mặc định
                } catch (error) {
                        console.error("Error updating actress in frontend:", error.message);
                        errorSweetAlert("Error in backend");
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
                        errorSweetAlert("Error in frontend");
                }
        }
}
    




import config2 from "../../../services/config.js";
import { RenderSidebar } from "../../../services/loadElement/loadSidebar.js";

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
                        image.src = item.image || '/admin/static/images/face/profile-default.jpg'; // Fallback image if URL is missing
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
                        studioCell.textContent = item.studio || '';
                        tr.appendChild(studioCell);

                        // Films cell
                        const filmsCell = document.createElement('td');
                        filmsCell.textContent = item.skin || ''; // Assuming `films` is a field in the fetched data
                        tr.appendChild(filmsCell);

                        // Delete button cell
                        const deleteCell = document.createElement('td');
                        // deleteCell.style.display = 'flex';
                        // deleteCell.style.justifyContent = 'center';
                        // Create a container for the delete button
                        const deleteContainer = document.createElement('div');
                        const deleteButton = document.createElement('div');
                        // deleteButton.style.display = 'flex';
                        // deleteButton.style.justifyContent = 'center';
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

        // --- Add new actress modal ---
        const openModalButton = document.getElementById("openModalButton");
        const closeModalButton = document.getElementById("closeModalButton");
        const actressModal = document.getElementById("actressModal");

        // Show modal when clicking the "Create" button
        openModalButton.onclick = () => {
                actressModal.style.display = "block";
        };

        // Hide modal when clicking the close button
        closeModalButton.onclick = () => {
                actressModal.style.display = "none";
        };

        // Call handleImageUpload function to setup image upload logic
        handleImageUpload("profile-image", "image-upload");

        // Form submission handler
        createNewActress("actressForm", "actressModal");
}

// UploadImage
function handleImageUpload(imageElementId, fileInputElementId) {
        const imageElement = document.getElementById(imageElementId);
        const fileInput = document.getElementById(fileInputElementId);

        // Khi người dùng nhấn vào hình ảnh, kích hoạt input file
        imageElement.addEventListener("click", function() {
                fileInput.click(); // Kích hoạt input file
        });

        // Khi có thay đổi từ input file (người dùng chọn file mới)
        fileInput.addEventListener("change", function(event) {
                const file = event.target.files[0];
                if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                                imageElement.src = e.target.result; // Cập nhật hình ảnh với dữ liệu mới từ file được chọn
                        };
                        reader.readAsDataURL(file);
                }
        });
}

// Handle form submit
async function createNewActress(formId, modalId) {
        const actressForm = document.getElementById(formId);
        const actressModal = document.getElementById(modalId);
        const fileInput = document.getElementById('image-upload'); // Get the file input element
        const pica = window.pica();

        actressForm.onsubmit = async (event) => {
                event.preventDefault(); // Ngăn chặn hành vi mặc định của form
                // Lấy dữ liệu từ form
                const formData = {
                        name: document.getElementById("actress-name").value,
                        birth: document.getElementById("actress-birth").value,
                        skin: document.getElementById("actress-skin").value,
                        studio: document.getElementById("actress-studio").value,
                        body: document.getElementById("actress-body").value,
                        breast: document.getElementById("actress-breast").value,
                };

                try {
                        // Xử lý resize ảnh trước khi gửi đi
                        if(fileInput.files.length > 0) {
                                const orignialFile = fileInput.files[0];
                                const resizedImageBlob = await resizeImage(originalFile, 500, 500);
                                formData.image = await uploadImageToServer(resizedImageBlob);
                        }

                        // Gửi yêu cầu POST tới API để tạo nữ diễn viên mới
                        const response = await fetch(`${config2.domain}${config2.endpoints.actressCreate}`, {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                        });

                        if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const createdActress = await response.json();
                        console.log('Actress created successfully:', createdActress);

                        // Đóng modal và reset form sau khi thành công
                        actressModal.style.display = "none";
                        actressForm.reset();
                } catch (error) {
                        console.error('Error creating actress: ', error);
                }
        };
}

// Resize image
async function resizeImage(file, width, height) {
        return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                try {
                        await pica.resize(img, canvas);
                        canvas.toBlob((blob) => {
                        resolve(blob);
                        }, 'image/jpeg', 0.9);
                } catch (error) {
                        reject(error);
                }
                };
                img.onerror = () => reject('Failed to load image');
        });
}
// upload image to server
async function uploadImageToServer(imageBlob) {
        
}
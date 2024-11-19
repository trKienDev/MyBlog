import config2 from "../../../services/config.js";
import { setupModalHandlers } from "../../../services/HelperFunction/modal.js";
import { handleImageUpload } from "../../../services/HelperFunction/image.js";

export function loadStudioTable() {
        fetch(`${config2.domain}${config2.endpoints.studioList}`)
        .then(response => {
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(studioList => {
                const tbody = document.querySelector('#studio-table tbody');
                tbody.innerHTML = ''; // Xóa nội dung cũ (nếu có)

                studioList.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.setAttribute('data-id', item._id);

                        // Edit button cell
                        const editCell = document.createElement('td');
                        const editContainer = document.createElement('div');
                        editContainer.classList.add('edit-container');
                        editContainer.style.width = '100%';
                        editContainer.style.display = 'flex';
                        editContainer.style.justifyContent = 'center';
                        const editButton = document.createElement('div');
                        editButton.classList.add('btn-edit');
                        editButton.innerHTML = `<i class="fa-solid fa-pen" style="color: aliceblue;"></i>`;
                        editButton.onclick = () => handleEdit(item); // Function to handle edit action
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
                        image.src = `${config2.domain}/uploads/studio/logo/${item.image}` || '/admin/static/images/face/profile-default.jpg';
                        image.classList.add('profile');
                        imageCell.appendChild(image);
                        tr.appendChild(imageCell);

                        // Delete button cell
                        const deleteCell = document.createElement('td');
                        const deleteButton = document.createElement('div');
                        deleteButton.classList.add('btn-delete');
                        deleteButton.innerHTML = `<i class="fa-solid fa-trash" style="color: aliceblue;"></i>`;
                        deleteButton.onclick = () => handleDelete(item._id); // Function to handle delete action
                        deleteCell.appendChild(deleteButton);
                        tr.appendChild(deleteCell);

                        // Append the row to the table body
                        tbody.appendChild(tr);
                });
        })
        .catch(error => {
                console.error('Error fetching studio data: ', error);
        });
    
        setupModalHandlers("openModalButton", "closeModalButton", "studioModal"); // Setup open and close modal
        handleImageUpload("profile-image", "image-upload"); // Setup image upload logic
        createNewStudio("studioForm", "studioModal"); // Handle form submission for creating a new studio
}

async function createNewStudio(formId, modalId) {
        const studioForm = document.getElementById(formId);
        const studioModal = document.getElementById(modalId);
        const imageUploadInput = document.getElementById("image-upload");
        const profileImage = document.getElementById("profile-image");
    
        studioForm.onsubmit = async (event) => {
                event.preventDefault(); 
                const formData = new FormData(studioForm);
                try {
                        const response = await fetch(`${config2.domain}${config2.endpoints.studioCreate}`, {
                                method: 'POST',
                                body: formData
                        });

                        if (response.status !== 201) {
                                console.error('Failed to create studio. HTTP Status:', response.status);
                                        Swal.fire({
                                        title: 'Error!',
                                        text: 'An error occurred while creating studio. Please try again.',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                });
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const createdStudio = await response.json();

                        if (createdStudio._id) {
                                Swal.fire({
                                        title: 'Success!',
                                        text: 'Studio created successfully!',
                                        icon: 'success',
                                        confirmButtonText: 'OK'
                                });
                                loadStudioTable(); 
                        } else {
                                Swal.fire({
                                        title: 'Error!',
                                        text: 'Failed to create studio. Please try again.',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                });
                                throw new Error('Failed to create studio. Invalid response from server.');
                        }
                } catch (error) {
                        console.error('Error creating studio in frontend: ', error.message);
                        Swal.fire({
                                title: 'Error!',
                                text: 'An error occurred while creating studio. Please try again.',
                                icon: 'error',
                                confirmButtonText: 'OK'
                        });
                } finally {
                        studioForm.reset();
                        if (imageUploadInput) {
                                imageUploadInput.value = "";
                        }
                        if (profileImage) {
                                profileImage.src = "/admin/static/images/studio/default_studio.png";
                        }
                        studioModal.style.display = "none";
                }
        };
}

function handleEdit(studio) {
        const studioModal = document.getElementById("studioModal");
        const studioForm = document.getElementById("studioForm");
        const profileImage = document.getElementById("profile-image");
        const nameInput = document.getElementById("actress-name");
    
        nameInput.value = studio.name;
        profileImage.src = `${config2.domain}/uploads/studio/logo/${studio.image}`;
    
        studioModal.style.display = "block";
    
        studioForm.onsubmit = async (event) => {
                event.preventDefault();
    
                const formData = new FormData(studioForm);
                formData.append("id", studio._id);
    
                try {
                        const response = await fetch(`${config2.domain}${config2.endpoints.studioUpdate}`, {
                                method: 'PUT',
                                body: formData,
                        });
        
                        if (response.status !== 200) {
                                Swal.fire({
                                        title: 'Error!',
                                        text: 'An error occurred while updating studio.',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                });
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }
        
                        Swal.fire({
                                title: 'Success!',
                                text: 'Studio updated successfully!',
                                icon: 'success',
                                confirmButtonText: 'OK'
                        });
        
                        loadStudioTable(); // Reload table
                } catch (error) {
                        console.error('Error updating studio: ', error);
                        Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred while updating studio.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                        });
                } finally {
                        studioModal.style.display = "none";
                }
        };
}

function handleDelete(studioId) {
        Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
                if (result.isConfirmed) {
                        try {
                                const response = await fetch(`${config2.domain}${config2.endpoints.studioDelete}/${studioId}`, {
                                        method: 'DELETE',
                                });

                                if (response.status !== 200) {
                                        Swal.fire({
                                                title: 'Error!',
                                                text: 'Failed to delete the studio. Please try again.',
                                                icon: 'error',
                                                confirmButtonText: 'OK'
                                        });
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                }

                                Swal.fire({
                                        title: 'Deleted!',
                                        text: 'Studio has been deleted.',
                                        icon: 'success',
                                        confirmButtonText: 'OK'
                                });

                                loadStudioTable();
                         } catch (error) {
                                console.error('Error deleting studio: ', error);
                                Swal.fire({
                                        title: 'Error!',
                                        text: 'Failed to delete the studio. Please try again.',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                });
                        }
                }
        });
}
    
import config2 from "../../../services/config.js";
import { setupModalHandlers } from "../../../services/module/modal.js";
import { handleImageUpload } from "../../../services/module/image.js";
import { createEditButtonCell, createTdTextCell, createImageCell, createDeleteButtonCell } from "../../../services/module/HTMLHandler.js";
import { errorSweetAlert, successSweetAlert } from "../../../services/module/sweetAlert.js";

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
                        const editCell = createEditButtonCell('edit-container', item, handleEdit);
                        tr.appendChild(editCell);

                        // Name cell
                        const nameCell = createTdTextCell(item.name);
                        tr.appendChild(nameCell);

                        // Image cell
                        const imgSrc = `${config2.domain}/uploads/studio/${item.image}` || '/admin/static/images/face/profile-default.jpg';
                        const imageCell = createImageCell(imgSrc, 'profile');
                        tr.appendChild(imageCell);

                        // Delete button cell
                        const deleteCell = createDeleteButtonCell(item._id, 'btn-delete', handleDelete);
                        tr.appendChild(deleteCell);

                        // Append the row to the table body
                        tbody.appendChild(tr);
                });
        })
        .catch(error => {
                console.error('Error fetching studio data: ', error);
        });
        loadStudioOptions();
        setupModalHandlers("openModalButton", "closeModalButton", "studioModal"); // Setup open and close modal
        handleImageUpload("profile-image", "image-upload"); // Setup image upload logic
        createNewStudio("studioForm", "studioModal"); // Handle form submission for creating a new studio
        document.getElementById('sidebar-form').addEventListener('submit', createNewCodeAV);
}

async function loadStudioOptions() {
        try {
                const response = await fetch(`${config2.domain}${config2.endpoints.studioList}`);
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const studios = await response.json();
                const studioSelect = document.getElementById('codeAV-studio');
                studioSelect.innerHTML = '<option value="" disabled selected>Select studio</option>';

                studios.forEach(studio => {
                        const option = document.createElement('option');
                        option.value = studio._id; 
                        option.textContent = studio.name; 
                        studioSelect.appendChild(option);
                });
        } catch (error) {
                console.error('Error loading studios for select:', error);
        }
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
                                errorSweetAlert("Error in backend");
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const createdStudio = await response.json();

                        if (createdStudio._id) {
                                successSweetAlert("studio created");
                                loadStudioTable(); 
                        } else {
                                errorSweetAlert("Error in backend");
                                throw new Error('Failed to create studio. Invalid response from server.');
                        }
                } catch (error) {
                        console.error('Error creating studio in frontend: ', error.message);
                        errorSweetAlert("Error in frontend");
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
        profileImage.src = `${config2.domain}/uploads/studio/${studio.image}`;
    
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
                                errorSweetAlert("Error in backend");
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }
        
                        successSweetAlert("Studio updated");
        
                        loadStudioTable(); // Reload table
                } catch (error) {
                        console.error('Error updating studio: ', error);
                        errorSweetAlert("Error in frontend");
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
                                        errorSweetAlert("Error in backend");
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                }

                                successSweetAlert("Studio deleted");

                                loadStudioTable();
                         } catch (error) {
                                console.error('Error deleting studio: ', error);
                                errorSweetAlert("Error in frontend");
                        }
                }
        });
}
    
async function createNewCodeAV(event) {
        event.preventDefault();

        const studioSelect = document.getElementById('codeAV-studio');
        const codeInput = document.getElementById('codeAV-name');

        const studioId = studioSelect.value; 
        const codeName = codeInput.value.trim(); 

        if (!studioId || !codeName) {
                errorSweetAlert("Please select a studio and enter a code name");
                return;
        }

        const payload = { studio: studioId, codeName };

        try {
                const response = await fetch(`${config2.domain}${config2.endpoints.codeAVCreate}`, {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                });
        
                if (response.ok) {
                        const data = await response.json();
                        successSweetAlert("Code created");
                        codeInput.value = '';
                        studioSelect.value = '';
                } else {
                        const errorData = await response.json();
                        const message = errorData.message || 'An error occurred while creating the code.';
                        errorSweetAlert(message);
                }
        } catch (error) {
                console.error('Error creating code:', error);
                errorSweetAlert("Error in frontend");
        } finally {
                codeInput.value = '';
                studioSelect.value = '';
        }
}


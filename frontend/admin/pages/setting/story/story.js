import config2 from "../../../services/config.js";
import { loadContent } from '../../../services/loadElement/loadDynamicPages.js';
import { setupModalHandlers } from "../../../services/module/modal.js";
import { createEditButtonCell, createTdTextCell, createDeleteButtonCell } from "../../../services/module/HTMLHandler.js";
import { errorSweetAlert, successSweetAlert } from "../../../services/module/sweetAlert.js";
import { deleteAPI, fetchAPI, postAPI, putAPI } from "../../../../services/apiService.js";
import { showToastNotification } from "../../../services/module/sweetAlert.js";


export async function loadStory() {
        try {
                const storyResponse = await fetchAPI(config2.endpoints.storyList);
                const storyList = await storyResponse.json();

                const tbody = document.querySelector("#story-table tbody");
                tbody.innerHTML = '';

                storyList.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.setAttribute('data-id', item._id);

                        // Edit button cell
                        const editCell = createEditButtonCell('edit-container', item, handleEdit);
                        tr.appendChild(editCell);
                        
                        // Name cell
                        const nameCell = createTdTextCell(item.name);
                        tr.appendChild(nameCell);

                        //  Motip cell
                        const motipCell = document.createElement('td');
                        motipCell.textContent = item.motip || '';
                        tr.appendChild(motipCell);

                        //  Role cell
                        const roleCell = document.createElement('td');
                        roleCell.textContent = item.role_actress || '';
                        tr.appendChild(roleCell);

                        // Detail cell
                        const detailCell = document.createElement('td');
                        detailCell.textContent = item.detail || '';
                        tr.appendChild(detailCell);

                        // Delete button cell
                        const deleteCell = createDeleteButtonCell(item._id, 'btn-delete', handleDelete);
                        deleteCell.style.display = "flex";
                        deleteCell.style.justifyContent = "center";
                        tr.appendChild(deleteCell);

                        tbody.appendChild(tr);   
                });
                setupModalHandlers("openModalButton", "closeModalButton", "storyModal");
                createNewStory("storyForm", "storyModal");
        } catch(error) {
                console.error("Error fetching data: ", error.message);
        }
}

async function createNewStory(formId, modalId) {
        const storyForm = document.getElementById(formId);
        const storyModal = document.getElementById(modalId);

        storyForm.onsubmit = async(event) => {
                event.preventDefault();

                const formData = new FormData(storyForm);
                const json = {};
                formData.forEach((value, key) => {
                        json[key] = value;
                });

                try {
                        const response = await postAPI(config2.endpoints.storyCreate, json);
                        if (response.status === 409) {
                                const result = await response.json(); 
                                const message = result.message || 'An error occurred while creating story.';
                                errorSweetAlert(message);
                                return;
                        }
                        
                        if (response.status !== 201) {
                                console.error('Failed to create story. HTTP Status:', response.status);
                                console.error('Error: ', response);
                                errorSweetAlert("error in backend");    
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const createdStory = await response.json();

                        if (createdStory._id) {
                                console.log('Story is created successfully:', createdStory);
                                successSweetAlert("story created");
                        } else {
                                console.error('Invalid response from server:', createdStory);
                                errorSweetAlert("Error in backend");                     
                                throw new Error('Failed to create story. Invalid response from server.');
                        }
                } catch(error) {
                        errorSweetAlert("Error in frontend")
                } finally {
                        loadStory();
                        storyForm.reset();
                        storyModal.style.display = "none";
                }
        };
}

async function handleEdit(story) {
        console.log("run handleEdit");
        const storyModal = document.getElementById("storyModal");
        const storyForm = document.getElementById("storyForm");

        storyModal.style.display = "block";

        // Điền dữ liệu vào form
        document.getElementById("story-name").value = story.name || "";
        document.getElementById("story-detail").value = story.detail || "";
        document.getElementById("story-motip").value = story.motip || "";
        document.getElementById("actress-role").value = story.role_actress || "";
        document.getElementById("actor-role").value = story.role_actor || "";

        // Xử lý submit form
        storyForm.onsubmit = async(event) => {
                event.preventDefault();
                const formData = new FormData(storyForm);
                const json = {};
                formData.forEach((value, key) => {
                        json[key] = value;
                });

                try {
                        const response = await putAPI(`${config2.endpoints.storyUpdate}/${story._id}`, json);
                        successSweetAlert("Story updated");
                        loadStory();

                        storyModal.style.display = "none";
                        storyForm.reset();
                } catch(error) {
                        console.log("error: ", error);
                        errorSweetAlert("Error in frontend");
                }
        };
}

async function handleDelete(storyId) {
        const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
        });

        if(result.isConfirmed) {
                try {
                        const response = await deleteAPI(`${config2.endpoints.storyDelete}/${storyId}`)

                        Swal.fire(
                                'Deleted!',
                                'Story has been deleted',
                                'success'
                        );
                        showToastNotification("true", "success !");

                        loadStory()
                } catch (error) {
                        console.error('Error deleting story:', error);
                        errorSweetAlert("error in frontend");
                }
        }
}
import config2 from "../../../services/config.js";
import { loadContent } from '../../../services/loadElement/loadDynamicPages.js';
import { setupModalHandlers } from "../../../services/HelperFunction/modal.js";
import { errorSweetAlert, successSweetAlert } from "../../../services/HelperFunction/sweetAlert.js";


export function loadStory() {
        fetch(`${config2.domain}${config2.endpoints.storyList}`)
        .then(response => {
                if(!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
        }) 
        .then(storyList => {
                const tbody = document.querySelector("#story-table tbody");
                tbody.innerHTML = '';

                storyList.forEach(item => {
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
                        nameCell.textContent = item.name || '';
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
                        const deleteCell = document.createElement('td');
                        deleteCell.style.display = 'flex';
                        deleteCell.style.justifyContent = 'center';
                        const deleteButton = document.createElement('div');
                        deleteButton.classList.add('btn-delete');
                        deleteButton.innerHTML = `<i class="fa-solid fa-trash" style="color: aliceblue;"></i>`;
                        deleteButton.onclick = () => handleDelete(item._id); // function to handle delete action
                        deleteCell.appendChild(deleteButton);
                        tr.appendChild(deleteCell);

                        tbody.appendChild(tr);    
                });
        })
        .catch(error => {
                console.error('Error fetching story data: ', error);
        })
        setupModalHandlers("openModalButton", "closeModalButton", "storyModal");
        createNewStory("storyForm", "storyModal");
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
                        const response = await fetch(`${config2.domain}${config2.endpoints.storyCreate}`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(json), 
                        });

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
        const storyModal = document.getElementById("storyModal");
        const storyForm = document.getElementById("storyForm");

        storyModal.style.display = "block";

        // Điền dữ liệu vào form
        document.getElementById("story-name").value = story.name || "";
        document.getElementById("story-detail").value = story.detail || "";
        document.getElementById("story-motip").value = story.motip || "";
        document.getElementById("actress-role").value = story.role_actress || "";
        document.getElementById("actor-role").value = story.role_actor || "";
        document.getElementById("story-tag").value = story.tag || "";

        // Xử lý submit form
        storyForm.onsubmit = async(event) => {
                event.preventDefault();
                const formData = new FormData(storyForm);
                const json = {};
                formData.forEach((value, key) => {
                        json[key] = value;
                });

                try {
                        const response = await fetch(
                                `${config2.domain}${config2.endpoints.storyUpdate}/${story._id}`, {
                                        method: "PUT",
                                        headers: {
                                                'Content-Type' : 'application/json',
                                        },
                                        body: JSON.stringify(json), 
                                }
                        );
                        console.log("response: ", response);
                        
                        if (!response.ok) {
                                errorSweetAlert("Error in backend");
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        } else {
                                successSweetAlert("Story created");
                                
                                loadStory();

                                storyModal.style.display = "none";
                                storyForm.reset();
                        }
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
                        const response = await fetch(`${config2.domain}${config2.endpoints.storyDelete}/${storyId}`, {
                                method: 'DELETE',
                        });
                        if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const data = await response.json();

                        Swal.fire(
                                'Deleted!',
                                'Story has been deleted',
                                'success'
                        );

                        loadStory()
                } catch (error) {
                        console.error('Error deleting story:', error);
                        errorSweetAlert("error in frontend");
                }
        }
}
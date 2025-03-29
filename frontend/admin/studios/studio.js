import { SetupModalHandlers }  from "../../dom/setupPopupModal.js"; 
import { HandleImageUpload } from "../../dom/imageUI.js";
import { ErrorSweetAlert, SuccessSweetAlert, ConfirmSweetAlert } from "../../utils/sweetAlert.js";
import apiConfig from "../../services/apiConfig.js";

export function InitStudioAdmin() {
      LoadStudios();
      CreateNewStudio("studio-form", "studio-modal");
      SetupModalHandlers("openModalButton", "closeModalButton", "studio-modal");
      HandleImageUpload("img", "image-upload"); 
}

function LoadStudios() {
      fetch(`${apiConfig.server}${apiConfig.endpoints.getAllStudios}`)
      .then(response => {
            if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); 
      })
      .then(studioList => {
            const tbody = document.querySelector('#studio-table tbody');
            tbody.innerHTML = ''; 

            studioList.forEach(item => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', item._id);

                  const editCell = document.createElement('td');
                  const editContainer = document.createElement('div');
                  editContainer.classList.add('edit-container');
                  const editButton = document.createElement('div');
                  editButton.classList.add('btn-edit');
                  editButton.innerHTML = `<i class="fa-solid fa-pen"></i>`;
                  editButton.onclick = () => UpdateStudio(item); 
                  editContainer.appendChild(editButton);
                  editCell.appendChild(editContainer);
                  tr.appendChild(editCell);

                  const nameCell = document.createElement('td');
                  nameCell.textContent = item.name;
                  tr.appendChild(nameCell);

                  const imageCell = document.createElement('td');
                  const image = document.createElement('img');
                  image.src = `${apiConfig.server}/uploads/studio/${item.image}` || '/admin/static/images/face/profile-default.jpg';
                  image.classList.add('profile');
                  imageCell.appendChild(image);
                  tr.appendChild(imageCell);

                  const deleteCell = document.createElement('td');
                  const deleteButton = document.createElement('div');
                  deleteButton.classList.add('btn-delete');
                  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
                  deleteButton.onclick = () => DeleteStudio(item._id);
                  deleteCell.appendChild(deleteButton);
                  tr.appendChild(deleteCell);

                  tbody.appendChild(tr);
            });
      })
      .catch(error => {
            console.error('Error fetching studio data: ', error);
      });
}

async function CreateNewStudio(formId, modalId) {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");
      const submitBtn = form.querySelector('button[type="submit"]');
      
      const resetOptions = { form, image, imgInput, modal };

      form.onsubmit = async (event) => {
            event.preventDefault(); 
            submitBtn.disabled = true;

            const formData = new FormData(form);
            try {
                  const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.createStudio}`, {
                        method: 'POST',
                        body: formData
                  });

                  if (!response.ok) {
                        ErrorSweetAlert("Error in backend");
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }

                  let result;
                  try {
                        result = await response.json();
                  } catch {
                        errorSweetAlert("Invalid response format");
                        return;
                  }

                  if (result._id) {
                        SuccessSweetAlert("studio created");
                        LoadStudios(); 
                  } else {
                        ErrorSweetAlert("Error in backend");
                        throw new Error('Failed to create studio. Invalid response from server.');
                  }
            } catch (error) {
                  console.error('Error creating studio in frontend: ', error.message);
                  ErrorSweetAlert("Error in frontend");
            } finally {
                  submitBtn.disabled = false;
                  ResetModal(resetOptions);
            }
      };
}

function UpdateStudio(studio) {
      const modal = document.getElementById("studio-modal");
      const form = document.getElementById("studio-form");
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");
      const name = document.getElementById("studio-name");  

      name.value = studio.name;
      image.src = `${apiConfig.server}/uploads/studio/${studio.image}`;
      modal.style.display = "block";

      const resetOptions = { form, image, imgInput, modal };
      const closeBtn = document.getElementById("closeModalButton");
      if(closeBtn) {
            closeBtn.onclick = () => ResetModal(resetOptions);
      }

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);

            try {
                  const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.updateStudio}/${studio._id}`, {
                        method: 'PUT',
                        body: formData,
                  });

                  if(!response.ok) {
                        ErrorSweetAlert("Error inbackend");
                        throw new Error(`HTTP error: ${response.message}`);
                  }

                  SuccessSweetAlert("studio updated");

                  LoadStudios();
            } catch(error) {
                  console.error("Error updating studio: ", error);
                  ErrorSweetAlert("Error in frontend");
            } finally {
                  ResetModal(resetOptions);
            }
      };
}

function DeleteStudio(id) {
      ConfirmSweetAlert("You won't be able to revert this!", async () => {
            try {
                  const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.deleteStudio}/${id}`, {
                        method: 'DELETE',
                  });

                  if (!response.ok) {
                        ErrorSweetAlert("Error in backend");
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }

                  SuccessSweetAlert("Studio deleted");
                  LoadStudios();
            } catch (error) {
                  console.error('Error deleting studio: ', error);
                  ErrorSweetAlert("Error in frontend");
            }
      });
}
    
function ResetModal({ form, image, imgInput, modal, defaultImg}) {
      if(form) form.reset();
      if(image)  image.src = defaultImg || "/admin/static/images/studio/studio-upload.png";
      if(imgInput) imgInput.value = "";
      if(modal) modal.style.display = "none";
}
import apiConfig from "../../../services/apiConfig.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweetAlert.js";
import { SetupModalHandlers } from "../../dom/setupPopupModal.js";
import { HandleImageUpload } from "../../dom/imageUI.js";

export function initCreatorAdmin() {
      createNewCreator("creator-form", "creator-modal");
      SetupModalHandlers("openModalButton", "closeModalButton", "creator-modal");
      HandleImageUpload("img", "image-upload");
      loadStudios("creator-studio");
}

async function createNewCreator(formId, modalId) {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("profile-image");

      form.onsubmit = async(event) => {
            event.preventDefault();
            const formData = new FormData(form);
            
            try {
                  const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.createCreator}`, {
                        method: 'POST',
                        body: formData
                  });

                  if(response.status === 409) {
                        const result = await response.json();
                        const message = result.message ||  'An error occurred while creating creator.';
                        ErrorSweetAlert(message);
                        return;
                  }

                  if(response.status !== 201) {
                        console.error('Failed to create creator. HTTP Status:', response.status);
                        console.error('Error: ', response);
                        ErrorSweetAlert('Error in backend');    
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }

                  const createdCreator = await response.json();

                  if(createdCreator._id) {
                        SuccessSweetAlert('Creator created successfully!');
                  } else {
                        ErrorSweetAlert('Error in backend.');                      
                        throw new Error('Failed to create creator. Invalid response from server.');
                  }
            } catch(error) {
                  console.error('Error creating creator in frontend: ', error.message);
                  ErrorSweetAlert('Error in frontend');
            } finally {
                  form.reset();
                  if(imgInput) {
                        imgInput.value = "";
                  }
                  if(image) {
                        image.src = "/admin/static/images/face/upload-profile.jpg"; 
                  }
                  modal.style.display = "none";
            }
      }
}

async function loadStudios(studioElement) {
      try {
            const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.getAllStudios}`);
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const studios = await response.json();
            const studioSelect = document.getElementById(studioElement);
            studioSelect.innerHTML = '<option value="" disabled selected>Select studio</option>';
            studios.forEach(studio => {
                  const option = document.createElement('option');
                  option.value = studio._id; 
                  option.textContent = studio.name; 
                  studioSelect.appendChild(option);
            });
      } catch(error) {
            console.error('Error loading studios: ', error);
      }
}

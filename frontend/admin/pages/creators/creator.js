import apiConfig from "../../../services/apiConfig.js";
import { errorSweetAlert } from "../../services/HelperFunction/sweetAlert.js";

export function initCreatorAdmin() {
      console.log("init creator!");
      //createNewCreator("creatorForm", "creatorModal");
}

async function createNewCreator(formId, modalId) {
      const creatorForm = document.getElementById(formId);
      const creatorModal = document.getElementById(modalId);
      const imgUploadInput = document.getElementById("image-upload");
      const profileImg = document.getElementById("profile-image");

      creatorForm.onsubmit = async(event) => {
            event.preventDefault();
            const formData = new FormData(creatorForm);
            
            try {
                  const response = await fetch(`${apiConfig.backendDomain}${apiConfig.endpoints.createCreator}`, {
                        method: 'POST',
                        body: formData
                  });

                  if(response.status === 409) {
                        const result = await response.json();
                        const message = result.message ||  'An error occurred while creating creator.';
                        errorSweetAlert(message);
                        return;
                  }

                  if(response.status !== 201) {
                        console.error('Failed to create creator. HTTP Status:', response.status);
                        console.error('Error: ', response);
                        errorSweetAlert('Error in backend');    
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }

                  const createdCreator = await response.json();

                  if(createdCreator._id) {
                        successSweetAlert('Creator created successfully!');
                  } else {
                        errorSweetAlert('Error in backend.');                      
                        throw new Error('Failed to create creator. Invalid response from server.');
                  }
            } catch(error) {
                  console.error('Error creating creator in frontend: ', error.message);
                  errorSweetAlert('Error in frontend');
            } finally {
                  creatorForm.reset();
                  if(imgUploadInput) {
                        imgUploadInput.value = "";
                  }
                  if(profileImg) {
                        profileImg.src = "/admin/static/images/face/upload-profile.jpg"; 
                  }
                  creatorModal.style.display = "none";
            }
      }
}
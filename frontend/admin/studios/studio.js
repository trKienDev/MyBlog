import { ResetModal, SetupModalHandlers }  from "../../dom/modal.dom.js";
import { HandleImageUpload } from "../../dom/image.dom.js";
import { ErrorSweetAlert, SuccessSweetAlert, ConfirmSweetAlert } from "../../utils/sweetAlert.js";
import apiConfig from "../../api/api.config.js";
import * as fetchAPI from "../../api/fetch.api.js";
import { CreateDeleteButtonCell, CreateEditButtonCell, CreateImageCell, CreateTdTextCell } from "../../dom/table.dom.js";

let formId = "studio-form";
let modalId = "studio-modal";
let studioTable = "#studio-table tbody";
let defaultImg = "/admin/static/images/studio/studio-upload.png";

export function InitStudioAdmin() {
      RenderStudios(studioTable);
      CreateNewStudio("studio-form", "studio-modal");
      SetupModalHandlers("openModalButton", "closeModalButton", "studio-modal");
      HandleImageUpload("img", "image-upload"); 
}

async function RenderStudios(element) {
      try {
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            const studios = await fetchAPI.GetList(apiConfig.endpoints.getStudios);

            studios.forEach(studio => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', studio._id);

                  const editBtn = CreateEditButtonCell('edit-container', studio, UpdateStudio);
                  tr.appendChild(editBtn);

                  const name = CreateTdTextCell(studio?.name);
                  tr.appendChild(name);

                  const imgSrc = `${apiConfig.server}/uploads/studio/${studio.image}`;
                  const image = CreateImageCell(imgSrc, 'profile');
                  tr.appendChild(image);

                  const deleteBtn = CreateDeleteButtonCell(studio._id, 'btn-delete', DeleteStudio);
                  tr.appendChild(deleteBtn);

                  tbody.appendChild(tr);
            });

      } catch(error) {
            console.error('Error loading studios: ', error);
      }
}

async function CreateNewStudio(formId, modalId) {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");
      const submitBtn = form.querySelector('button[type="submit"]');
      
      const resetOptions = { form, image, imgInput, modal, defaultImg };

      form.onsubmit = async (event) => {
            event.preventDefault(); 
            submitBtn.disabled = true;

            const formData = new FormData(form);

            try {
                  const createdStudio = await fetchAPI.CreateItem(apiConfig.endpoints.createStudio, formData);

                  if (createdStudio._id) {
                        SuccessSweetAlert("studio created");
                        RenderStudios(studioTable);
                  } else {
                        ErrorSweetAlert("Error in server");
                        throw new Error('Failed to create studio. Invalid response from server.');
                  }
            } catch (error) {
                  console.error('Error creating studio in client: ', error.message);
                  ErrorSweetAlert("Create studio failed");
            } finally {
                  submitBtn.disabled = false;
                  ResetModal(resetOptions);
            }
      };
}

function UpdateStudio(studio) {
      const modal = document.getElementById(modalId);
      const form = document.getElementById(formId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");
      const name = document.getElementById("studio-name");  

      name.value = studio.name;
      image.src = `${apiConfig.server}/uploads/studio/${studio.image}`;
      modal.style.display = "block";

      const resetOptions = { form, image, imgInput, modal, defaultImg };
      const closeBtn = document.getElementById("closeModalButton");
      if(closeBtn) {
            closeBtn.onclick = () => ResetModal(resetOptions);
      }

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);

            try {
                  const updatedStudio = await fetchAPI.UpdateItem(`${apiConfig.endpoints.updateStudio}/${studio._id}`, formData);

                  if (updatedStudio._id) {
                        SuccessSweetAlert("studio updated");
                        RenderStudios(studioTable);
                  } else {
                        ErrorSweetAlert("Update studio failed");
                        throw new Error('Failed to create studio. Invalid response from server.');
                  }
            } catch(error) {
                  console.error("Error updating studio: ", error);
                  ErrorSweetAlert("Update studio failed");
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
            } catch (error) {
                  console.error('Error deleting studio: ', error);
                  ErrorSweetAlert("Error in frontend");
            } finally {
                  RenderStudios(studioTable);
            }
      });
}
    
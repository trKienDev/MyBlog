import apiConfig from "../../api/api.config.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweetAlert.js";
import { ResetModal, SetupModalHandlers } from "../../dom/modal.dom.js";
import { HandleImageUpload } from "../../dom/image.dom.js";
import * as fetchAPI from "../../api/fetch.api.js";
import { CreateDeleteButtonCell, CreateEditButtonCell, CreateImageCell, CreateTdTextCell } from "../../dom/table.dom.js";

let formId = "creator-form";
let modalId = "creator-modal";
let tableBody = "#creator-table tbody";
let defaultImg = "/admin/static/images/face/upload-profile.jpg";

export function initCreatorAdmin() {
      RenderCreators(tableBody);
      CreateNewCreator(formId, modalId);
      SetupModalHandlers("openModalButton", "closeModalButton", modalId);
      HandleImageUpload("img", "image-upload");
      LoadStudios("creator-studio");
}

async function RenderCreators(element) {
      try {
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            const creators = await fetchAPI.GetList(apiConfig.endpoints.getCreators);

            creators.forEach(creator => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', creator._id);

                  const editBtn = CreateEditButtonCell('edit-container', creator, UpdateCreator);
                  tr.appendChild(editBtn);

                  const name = CreateTdTextCell(creator.name);
                  tr.appendChild(name);

                  const imgSrc = `${apiConfig.server}/uploads/creator/avatar/${creator.image}`;
                  const image = CreateImageCell(imgSrc, 'profile');
                  tr.appendChild(image);
                  
                  const body = CreateTdTextCell(creator.body);
                  tr.appendChild(body);

                  const breast = CreateTdTextCell(creator.breast);
                  tr.appendChild(breast);

                  const studio = CreateTdTextCell(creator?.studio?.name);
                  tr.appendChild(studio);

                  const skin = CreateTdTextCell(creator.skin);
                  tr.appendChild(skin);
                  
                  const deleteBtn = CreateDeleteButtonCell(creator._id, 'btn-delete', DeleteCreator);
                  tr.appendChild(deleteBtn);

                  tbody.appendChild(tr); 
            });
      } catch(error) {
            console.error('Error loading creators: ', error);
      }
}

async function CreateNewCreator(formId, modalId) {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("profile-image");

      const resetOption = { form, image, imgInput, modal, defaultImg };

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);

            try {
                  const createdCreator = await fetchAPI.CreateItem(apiConfig.endpoints.createCreator, formData);

                  if(createdCreator._id) {
                        SuccessSweetAlert('Creator created successfully!');
                  } else {
                        ErrorSweetAlert('Error in backend.');                      
                        throw new Error('Failed to create creator. Invalid response from server.');
                  }
            } catch(error) {
                  console.error('Error creating creator in client: ', error.message);
                  ErrorSweetAlert('Create creator failed');
            } finally {
                  RenderCreators(tableBody);
                  ResetModal(resetOption);
            }
      }
}

async function UpdateCreator(creator) {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");
      
      const resetOption = { form, image, imgInput, modal, defaultImg};
      const closeBtn = document.getElementById("closeModalButton");
      if(closeBtn) {
            closeBtn.onclick = () => ResetModal(resetOptions);
      }

      modal.style.display = 'block';

      await LoadStudios("creator-studio");
      document.getElementById("creator-name").value = creator.name || "";
      document.getElementById("creator-birth").value = creator.birth ? new Date(creator.birth).toISOString().split("T")[0] : "";
      document.getElementById("creator-skin").value = creator.skin || "";
      document.getElementById("creator-studio").value = creator.studio?._id || "";
      document.getElementById("creator-breast").value = creator.breast || "";
      document.getElementById("creator-body").value = creator.body || "";
      image.src = creator.image ? `${apiConfig.server}/uploads/creator/avatar/${creator.image}` : defaultImg;

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);
            
            try {
                  const updatedCreator = await fetchAPI.UpdateItem(`${apiConfig.endpoints.updateCreator}/${creator._id}`, formData);

                  if (updatedCreator._id) {
                        SuccessSweetAlert("creator updated");
                        RenderCreators(tableBody);
                  } else {
                        ErrorSweetAlert("Update creator failed");
                        throw new Error('Failed to create creator. Invalid response from server.');
                  }
            } catch(error) {
                  console.error("Error updating creator in client: ", error);
                  ErrorSweetAlert("Update creator failed");
            } finally {
                  ResetModal(resetOption);
            }

      };

}

async function DeleteCreator(creator) {
      console.log("creator: ", creator);
}

async function LoadStudios(studioElement) {
      try {
            const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.getStudios}`);
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

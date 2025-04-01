import { ResetModal, SetupModalHandlers }  from "../../components/modal.component.js";
import { HandleImageUpload } from "../../components/image.component.js";
import { ErrorSweetAlert, SuccessSweetAlert, ConfirmSweetAlert } from "../../utils/sweetAlert.js";
import apiConfig from "../../api/api.config.js";
import * as fetchAPI from "../../api/fetch.api.js";
import { CreateDeleteButtonCell, CreateEditButtonCell, CreateImageCell, CreateTdTextCell } from "../../components/table.component.js";
import { SelectStudios } from "../../components/studio.component.js";

let formId = "studio-form";
let modalId = "studio-modal";
let studioTable = "#studio-table tbody";
let defaultImg = "/admin/static/images/studio/studio-upload.png";

export function InitStudioAdmin() {
      RenderStudios(studioTable);
      CreateNewStudio();
      SetupModalHandlers("openModalButton", "closeModalButton", "studio-modal");
      HandleImageUpload("img", "image-upload"); 
      SelectStudios("studio-selection");
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

async function CreateNewStudio() {
      const { form, modal, imgInput, image } = getELement();
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
                        throw new Error('Failed to create studio');
                  }
            } catch (error) {
                  console.error('Error creating studio in client: ', error.message);
                  ErrorSweetAlert("Failed to create tag");
            } finally {
                  submitBtn.disabled = false;
                  ResetModal(resetOptions);
            }
      };
}

function UpdateStudio(studio) {
      const { form, modal, imgInput, image } = getELement();
      const name = document.getElementById("studio-name");  

      const title = document.querySelector("#studio-modal h2");
      title.innerHTML = "Edit studio";

      name.value = studio.name;
      image.src = `${apiConfig.server}/uploads/studio/${studio.image}`;
      modal.style.display = "block";

      const resetOptions = { form, image, imgInput, modal, defaultImg };

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);

            try {
                  const updatedStudio = await fetchAPI.UpdateItem(`${apiConfig.endpoints.updateStudio}/${studio._id}`, formData);

                  if (updatedStudio._id) {
                        SuccessSweetAlert("studio updated");
                        RenderStudios(studioTable);
                  } else {
                        ErrorSweetAlert("Failed to update studio");
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
      ConfirmSweetAlert("Delete this studio ?", async () => {
            try {
                  const deletedStudio = await fetchAPI.DeleteItem(`${apiConfig.endpoints.deleteStudio}/${id}`);
                  if(deletedStudio) {
                        SuccessSweetAlert("Studio deleted");
                  } else {
                        ErrorSweetAlert("Failed to delete studio");
                  }
            } catch (error) {
                  console.error('client: ', error);
                  ErrorSweetAlert("Delete studio failed");
            } finally {
                  RenderStudios(studioTable);
            }
      });
}

function getELement() {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");

      return { form, modal, imgInput, image };
}

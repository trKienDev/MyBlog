import { ResetModal, SetupModalHandlers }  from "../../components/modal.component.js";
import { HandleImageUpload } from "../../components/image.component.js";
import { ErrorSweetAlert, SuccessSweetAlert, ConfirmSweetAlert } from "../../utils/sweetAlert.js";
import apiConfig from "../../api/api.config.js";
import * as fetchAPI from "../../api/fetch.api.js";
import { CreateEditButtonCell, CreateImageCell, CreateTdTextCell } from "../../components/table.component.js";
import { SelectStudios } from "../../components/select.component.js";

let formId = "studio-form";
let modalId = "studio-modal";
let studioTable = "#studio-table tbody";
let defaultImg = "/admin/static/images/studio/studio-upload.png";

export function initStudioAdmin() {
      RenderStudios(studioTable);
      CreateNewStudio();
      SetupModalHandlers("open-modal_button", "close-modal_button", modalId);
      HandleImageUpload("img", "image-upload"); 
}

async function RenderStudios(element) {
      try {
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            const result = await fetchAPI.GetList(apiConfig.endpoints.getStudios);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const studios = result.data;
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

                  tbody.appendChild(tr);
            });

      } catch(error) {
            console.error('Error loading studios: ', error);
            ErrorSweetAlert(error);
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
                  const result = await fetchAPI.CreateItem(apiConfig.endpoints.createStudio, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  SuccessSweetAlert("studio created");
                  RenderStudios(studioTable);
            } catch (error) {
                  console.error('Error creating studio in client: ', error.message);
                  ErrorSweetAlert(error);
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
                  const result = await fetchAPI.UpdateItem(`${apiConfig.endpoints.updateStudio}/${studio._id}`, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  SuccessSweetAlert("studio updated");
                  RenderStudios(studioTable);
            } catch(error) {
                  console.error("Error updating studio: ", error);
                  ErrorSweetAlert(error);
            } finally {
                  ResetModal(resetOptions);
            }
      };
}

function getELement() {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");

      return { form, modal, imgInput, image };
}

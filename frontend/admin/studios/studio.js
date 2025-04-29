import modal_component from "../../components/modal.component.js";
import { HandleImageUpload } from "../../components/image.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import api_configs from "../../api/api.config.js";
import { create_editBtn, CreateImageCell, CreateTdTextCell } from "../../components/table.component.js";
import fetch_api from "../../api/fetch.api.js";

const { initModal, resetModal } = modal_component;

let formId = "studio-form";
let modalId = "studio-modal";
let studioTable = "#studio-table tbody";
let imgId = "img";
let imgInputId = 'image-upload';
let defaultImg = "/admin/static/images/studio/studio-upload.png";

export function initStudioAdmin() {
      RenderStudios(studioTable);
      CreateNewStudio();
      initModal("open-modal_button", "close-modal_button", modalId, () => resetModal(formId, imgId, imgInputId, defaultImg));
      HandleImageUpload("img", "image-upload"); 
}

async function RenderStudios(element) {
      try {
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            const result = await fetch_api.apiGet(api_configs.endpoints.getStudios);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const studios = result.data;
            studios.forEach(studio => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', studio._id);

                  const editBtn = create_editBtn('edit-container', studio, UpdateStudio);
                  tr.appendChild(editBtn);

                  const name = CreateTdTextCell(studio?.name);
                  tr.appendChild(name);

                  const imgSrc = `${api_configs.server}/uploads/studio/${studio.image}`;
                  const image = CreateImageCell(imgSrc, 'profile');
                  tr.appendChild(image);

                  tbody.appendChild(tr);
            });

      } catch(error) {
            console.error('Error loading studios: ', error);
            error_sweetAlert(error);
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
                  const result = await fetch_api.createForm(api_configs.endpoints.createStudio, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert("studio created");
                  RenderStudios(studioTable);
            } catch (error) {
                  console.error('Error creating studio in client: ', error.message);
                  error_sweetAlert(error);
            } finally {
                  submitBtn.disabled = false;
                  modal.style.display = "none";
                  resetModal(resetOptions);
            }
      };
}

function UpdateStudio(studio) {
      const { form, modal, imgInput, image } = getELement();
      const name = document.getElementById("studio-name");  

      const title = document.querySelector("#studio-modal h2");
      title.innerHTML = "Edit studio";

      name.value = studio.name;
      image.src = `${api_configs.server}/uploads/studio/${studio.image}`;
      modal.style.display = "block";

      const reset_options = { form, image, imgInput, modal, defaultImg };

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);

            try {
                  const result = await fetch_api.updateForm(`${api_configs.endpoints.updateStudio}/${studio._id}`, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert("studio updated");
                  RenderStudios(studioTable);
            } catch(error) {
                  console.error("Error updating studio: ", error);
                  error_sweetAlert(error);
            } finally {
                  modal.style.display = "none";
                  resetModal(reset_options);
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

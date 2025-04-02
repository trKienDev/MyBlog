import apiConfig from "../../api/api.config.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweetAlert.js";
import { ResetModal, SetupModalHandlers } from "../../components/modal.component.js";
import { HandleImageUpload } from "../../components/image.component.js";
import * as fetchAPI from "../../api/fetch.api.js";
import { CreateEditButtonCell, CreateImageCell, CreateTdTextCell } from "../../components/table.component.js";

let formId = "creator-form";
let modalId = "creator-modal";
let tableBody = "#creator-table tbody";
let defaultImg = "/admin/static/images/face/upload-profile.jpg";

export function initCreatorAdmin() {
      RenderCreators(tableBody);
      CreateNewCreator();
      SetupModalHandlers("open-modal_button", "close-modal_button", modalId);
      HandleImageUpload("img", "image-upload");
}

async function RenderCreators(element) {
      try {
            const result = await fetchAPI.GetList(apiConfig.endpoints.getCreators);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const creators = result.data;
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            
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

                  const skin = CreateTdTextCell(creator.skin);
                  tr.appendChild(skin);

                  tbody.appendChild(tr); 
            });
      } catch(error) {
            console.error('Error loading creators: ', error);
            ErrorSweetAlert(error);
      }
}

async function CreateNewCreator() {
      const { form, modal, imgInput, image } = getELement();
      const resetOptions = { form, image, imgInput, modal, defaultImg };

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);

            try {
                  const result = await fetchAPI.CreateItem(apiConfig.endpoints.createCreator, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  SuccessSweetAlert('Creator created');
            } catch(error) {
                  console.error('Error creating creator in client: ', error);
                  ErrorSweetAlert(error);
            } finally {
                  RenderCreators(tableBody);
                  ResetModal(resetOptions);
            }
      }
}

async function UpdateCreator(creator) {
      const { form, modal, imgInput, image } = getELement();
      
      const resetOptionss = { form, image, imgInput, modal, defaultImg};
      const closeBtn = document.getElementById("closeModalButton");
      if(closeBtn) {
            closeBtn.onclick = () => ResetModal(resetOptionss);
      }

      modal.style.display = 'block';

      document.getElementById("creator-name").value = creator.name || "";
      document.getElementById("creator-birth").value = creator.birth ? new Date(creator.birth).toISOString().split("T")[0] : "";
      document.getElementById("creator-skin").value = creator.skin || "";

      document.getElementById("creator-breast").value = creator.breast || "";
      document.getElementById("creator-body").value = creator.body || "";
      image.src = creator.image ? `${apiConfig.server}/uploads/creator/avatar/${creator.image}` : defaultImg;

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);
            
            try {
                  const result = await fetchAPI.UpdateItem(`${apiConfig.endpoints.updateCreator}/${creator._id}`, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  SuccessSweetAlert("creator updated");
                  RenderCreators(tableBody);
            } catch(error) {
                  console.error("Error updating creator in client: ", error);
                  ErrorSweetAlert(error);
            } finally {
                  ResetModal(resetOptionss);
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

import api_configs from "../../api/api.config.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import modal_component from "../../components/modal.component.js";
import { HandleImageUpload } from "../../components/image.component.js";
import  table_component from "../../components/table.component.js";
import fetch_api from "../../api/fetch.api.js";
import css_selectors from "../../selectors/css.selectors.js";

let formId = "creator-form";
let imgId = "img";
let imgInputId = "image-upload";
let modalId = "creator-modal";
let tableBody = "#creator-table tbody";
let defaultImg = "/admin/static/images/face/upload-profile.jpg";

const { initModal, resetModal } = modal_component;

export function initCreatorAdmin() {
      RenderCreators(tableBody);
      CreateNewCreator();
      initModal("open-modal_button", "close-modal_button", modalId, () => resetModal(formId, imgId, imgInputId, defaultImg ));
      HandleImageUpload("img", "image-upload");
}

async function RenderCreators(element) {
      try {
            const result = await fetch_api.apiGet(api_configs.endpoints.getCreators);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const creators = result.data;
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            
            creators.forEach(creator => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', creator._id);

                  const editBtn = table_component.createEditBtn(css_selectors.container.edit_container, creator, UpdateCreator);
                  tr.appendChild(editBtn);

                  const name = table_component.createTextTd({ i_text: creator.name });
                  tr.appendChild(name);

                  const imgSrc = `${api_configs.server}/uploads/creator/avatar/${creator.image}`;
                  const image = table_component.createImageTd(imgSrc, 'profile');
                  tr.appendChild(image);
                  
                  const body = table_component.createTextTd({ i_text: creator.body });
                  tr.appendChild(body);

                  const breast = table_component.createTextTd({ i_text: creator.breast });
                  tr.appendChild(breast);

                  const skin = table_component.createTextTd({ i_text: creator.skin });
                  tr.appendChild(skin);

                  tbody.appendChild(tr); 
            });
      } catch(error) {
            console.error('Error loading creators: ', error);
            error_sweetAlert(error);
      }
}

async function CreateNewCreator() {
      const { form, modal, imgInput, image } = getELement();
      const resetOptions = { form, image, imgInput, modal, defaultImg };

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);

            try {
                  const result = await fetch_api.createForm(api_configs.endpoints.createCreator, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert('Creator created');
            } catch(error) {
                  console.error('Error creating creator in client: ', error);
                  error_sweetAlert(error);
            } finally {
                  modal.style.display = "none";
                  RenderCreators(tableBody);
                  resetModal(resetOptions);
            }
      }
}

async function UpdateCreator(creator) {
      const { form, modal, imgInput, image } = getELement();
      
      const resetOptionss = { form, image, imgInput, modal, defaultImg};
      const closeBtn = document.getElementById("closeModalButton");
      if(closeBtn) {
            closeBtn.onclick = () => resetModal(resetOptionss);
      }

      modal.style.display = 'block';

      document.getElementById("creator-name").value = creator.name || "";
      document.getElementById("creator-birth").value = creator.birth ? new Date(creator.birth).toISOString().split("T")[0] : "";
      document.getElementById("creator-skin").value = creator.skin || "";

      document.getElementById("creator-breast").value = creator.breast || "";
      document.getElementById("creator-body").value = creator.body || "";
      image.src = creator.image ? `${api_configs.server}/uploads/creator/avatar/${creator.image}` : defaultImg;

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData(form);
            
            try {
                  const result = await fetch_api.updateForm(`${api_configs.endpoints.updateCreator}/${creator._id}`, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert("creator updated");
                  RenderCreators(tableBody);
            } catch(error) {
                  console.error("Error updating creator in client: ", error);
                  error_sweetAlert(error);
            } finally {
                  modal.style.display = "none";
                  resetModal(resetOptionss);
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

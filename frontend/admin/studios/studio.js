import modal_component from "../../components/modal.component.js";
import { HandleImageUpload } from "../../components/image.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import api_configs from "../../api/api.config.js";
import fetch_api from "../../api/fetch.api.js";
import table_component from "../../components/table.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";

let imgId = "img";
let imgInputId = 'image-upload';
let defaultImg = "/admin/static/images/studio/studio-upload.png";

export function initStudioAdmin() {
      RenderStudios(id_selectors.table.studio_tbody);
      CreateNewStudio();
      modal_component.initModal(id_selectors.modal.open_button, id_selectors.modal.close_button, id_selectors.studio.studio_modal, () => modal_component.resetModal(id_selectors.studio.studio_form, imgId, imgInputId, defaultImg));
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
            studios.forEach(async (studio) => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', studio._id);

                  const edit_btn = await table_component.createEditBtn(css_selectors.container.edit_container, studio, UpdateStudio);
                  tr.appendChild(edit_btn);

                  const name = await table_component.createTextTd({ i_text: studio?.name });
                  tr.appendChild(name);

                  const img_src = `${api_configs.server}/uploads/studio/${studio.image}`;
                  const image = await table_component.createImageTd(img_src, 'profile');
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
                  RenderStudios(id_selectors.table.studio_tbody);
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
                  RenderStudios(id_selectors.table.studio_tbody);
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
      const form = document.getElementById(id_selectors.studio.studio_form);
      const modal = document.getElementById(id_selectors.studio.studio_modal);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");

      return { form, modal, imgInput, image };
}

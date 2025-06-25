import modal_component from "../../components/modal.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import api_configs from "../../api/api.config.js";
import fetch_api from "../../api/fetch.api.js";
import table_component from "../../components/table.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { api_admin } from "../../api/endpoint.api.js";

export function AdminStudioController() {
      RenderStudios(id_selectors.table.studio_tbody);
      CreateNewStudio();
      modal_component.initModal(
            "open-modal_button", "close-modal_button", "studio-modal", 
            () => modal_component.resetModal("studio-form")
      );
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

                  tbody.appendChild(tr);
            });

      } catch(error) {
            console.error('Error loading studios: ', error);
            error_sweetAlert(error);
      }
}



async function CreateNewStudio() {
      const { form, modal } = getELement();
      const submitBtn = form.querySelector('button[type="submit"]');
      
      const resetOptions = { form };

      form.onsubmit = async (event) => {
            event.preventDefault(); 
            submitBtn.disabled = true;

            const studio_name = document.getElementById('studio-name').value;
            const json_data = { name: studio_name };
            console.log('json data: ', json_data);
            try {
                  const result = await fetch_api.createJson(`${api_admin.createStudio}`, json_data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert("studio created");
                  RenderStudios(id_selectors.table.studio_tbody);
            } catch (error) {
                  console.error('Error creating studio: ', error);
                  error_sweetAlert(error);
            } finally {
                  submitBtn.disabled = false;
                  modal.style.display = "none";
                  modal_component.resetModal(resetOptions);
            }
      };
}

function UpdateStudio(studio) {
      const { form, modal } = getELement();
      const name = document.getElementById("studio-name");  

      const title = document.querySelector("#studio-modal h2");
      title.innerHTML = "Edit studio";

      name.value = studio.name;
      modal.style.display = "block";

      const reset_options = { form };

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
                  modal_component.resetModal(reset_options);
            }
      };
}

function getELement() {
      const form = document.getElementById(id_selectors.studio.studio_form);
      const modal = document.getElementById(id_selectors.studio.studio_modal);

      return { form, modal };
}

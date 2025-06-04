import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import api_configs from "../../api/api.config.js";
import fetch_api from "../../api/fetch.api.js";
import table_component from "../../components/table.component.js";
import select_component from "../../components/select.component.js";

let formStudio = "form-studio";
let studioSelection = "studio-selection";

export function initCodeAdmin() {
      select_component.selectStudios(studioSelection);
      select_component.selectStudios(formStudio);
      CreateNewCode();
      RenderCodeBySelectedStudio();
}

async function RenderCodeBySelectedStudio() {
      const studio = document.getElementById(studioSelection);
      studio.addEventListener("change", function(event) {
            const value = event.target.value;
            return RenderCodes(value);
      });
}

async function RenderCodes(studio_id) {
      try {
            const tbody = document.querySelector("#list-codes tbody");
            tbody.innerHTML = '';

            const result = await fetch_api.apiGet(`${api_configs.endpoints.getCodesByStudio}/${studio_id}`);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const codes = result.data;
            codes.forEach(item => {
                  const row = table_component.createTrWithId(item._id);
                  const code = table_component.createTextTd({i_text: item.code});
                  row.appendChild(code);
                  tbody.appendChild(row);
            });
      } catch(error) {
            console.error('Error rendering codes: ', error);
      }
}

async function CreateNewCode() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const studio = document.getElementById(formStudio);
            const code = document.getElementById('form-code').value;
            const upperCase_code = code.toUpperCase();

            const data = { studio: studio.value , code: upperCase_code };
            try {
                  const result = await fetch_api.createJson(`${api_configs.endpoints.createCode}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }
                  
                  success_sweetAlert("code created");
            } catch(error) {
                  console.error('Error creating code: ', error.message);
                  error_sweetAlert(error);
            } finally {
                  const selectStudio = document.getElementById(studioSelection);
                  selectStudio.value = studio.value;
                  RenderCodes(studio.value);
                  studio.value = "";
                  code = "";
            }
      });
}
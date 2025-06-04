import api_configs from "../api/api.config.js";
import fetch_api from "../api/fetch.api.js";
import { error_sweetAlert } from "../utils/sweet-alert.js";

async function selectStudios(studioId) {
      try {
            const result = await fetch_api.apiGet(api_configs.endpoints.getStudios);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            
            const studios = result.data;
            renderSelectElement(studioId, studios, 'studio', 'name');
      } catch(error) {
            console.error('Error render studio elements in select.component.js', error);
            error_sweetAlert(error);
      }
}

async function selectCodes(codeId) {
      try {
            const result = await fetch_api.apiGet(api_configs.endpoints.getCodes);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const codes = result.data;
            renderSelectElement(codeId, codes, 'code', 'code');
      } catch(error) {
            console.error('Error render code elements in select.component.js', error);
            error_sweetAlert(error);
      }
}

async function selectCodeByStudio(codeId, studio_id) {
      const result = await fetch_api.apiGet(`${api_configs.endpoints.getCodesByStudio}/${studio_id}`);
      if(result.success === false) {
            throw new Error(result.error);
      }

      const codes = result.data;

      renderSelectElement(codeId, codes, '', 'code', 1);
}

async function selectCreators(creatorId) {
      try {
            const result = await fetch_api.apiGet(api_configs.endpoints.getCreators);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            
            const creators = result.data;
            renderSelectElement(creatorId, creators, 'creator', 'name');
      } catch(error) {
            console.error('Error render creator elements in select.component.js: ', error);
            error_sweetAlert(error);
      }
}

async function selectFilmTags(tagId) {
      try {
            const result = await fetch_api.apiGet(api_configs.endpoints.getFilmTags);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            const tags = result.data;
            renderSelectElement(tagId, tags, 'tag', 'name');
      } catch(error) {
            console.error('Error render tag element in select.component.js: ', error);
            error_sweetAlert(error);
      }
}

function renderSelectElement(selectId, data, placeholder, value, option) {
      try {
            const selectElement = document.getElementById(selectId);
            selectElement.innerHTML = `<option value="" disabled selected multiple>Select ${placeholder}</option>`;
            if(option === 1 ) selectElement.innerHTML = '';
            data.forEach(item => {
                  const option = document.createElement('option');
                  option.value = item._id;
                  option.textContent = item[value];
                  selectElement.appendChild(option);
            });
      } catch(error) {
            console.error('Error in RenderSelectElement: ', error);
            error_sweetAlert(error);
      }
}

function getCodeOptionByStudoId(element_id, code_id) {
      const select_element = document.getElementById(element_id);
      select_element.value = code_id;

      return select_element;
}

const select_component = {
      selectStudios,
      selectCodeByStudio,
      getCodeOptionByStudoId,
}
export default select_component;
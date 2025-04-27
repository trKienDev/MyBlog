import api_configs from "../api/api.config.js";
import * as fetchAPI from "../api/fetch.api.js";
import { error_sweetAlert } from "../utils/sweet-alert.js";

export async function SelectStudios(studioId) {
      try {
            const result = await fetchAPI.get(api_configs.endpoints.getStudios);
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

export async function SelectCodes(codeId) {
      try {
            const result = await fetchAPI.get(api_configs.endpoints.getCodes);
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

export async function selectCodeByStudio(codeId, studio_id) {
      try {
            const result = await fetchAPI.get(`${api_configs.endpoints.getCodesByStudio}/${studio_id}`);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const codes = result.data;

            renderSelectElement(codeId, codes, '', 'code', 1);
      } catch(error) {
            console.error('Error getting codes by studio: ', error);
      }
}

export async function selectCreators(creatorId) {
      try {
            const result = await fetchAPI.get(api_configs.endpoints.getCreators);
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

export async function SelectFilmTags(tagId) {
      try {
            const result = await fetchAPI.get(api_configs.endpoints.getFilmTags);
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


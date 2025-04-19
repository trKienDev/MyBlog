import apiConfig from "../api/api.config.js";
import * as fetchAPI from "../api/fetch.api.js";
import { ErrorSweetAlert } from "../utils/sweet-alert.js";

export async function SelectStudios(studioId) {
      try {
            const result = await fetchAPI.Get(apiConfig.endpoints.getStudios);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            
            const studios = result.data;
            RenderSelectElement(studioId, studios, 'studio', 'name');
      } catch(error) {
            console.error('Error render studio elements in select.component.js', error);
            ErrorSweetAlert(error);
      }
}

export async function SelectCodes(codeId) {
      try {
            const result = await fetchAPI.Get(apiConfig.endpoints.getCodes);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const codes = result.data;
            RenderSelectElement(codeId, codes, 'code', 'code');
      } catch(error) {
            console.error('Error render code elements in select.component.js', error);
            ErrorSweetAlert(error);
      }
}

export async function selectCodeByStudio(codeId, studio_id) {
      try {
            const result = await fetchAPI.Get(`${apiConfig.endpoints.getCodesByStudio}/${studio_id}`);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const codes = result.data;

            RenderSelectElement(codeId, codes, '', 'code', 1);
      } catch(error) {
            console.error('Error getting codes by studio: ', error);
      }
}

export async function selectCreators(creatorId) {
      try {
            const result = await fetchAPI.Get(apiConfig.endpoints.getCreators);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            
            const creators = result.data;
            RenderSelectElement(creatorId, creators, 'creator', 'name');
      } catch(error) {
            console.error('Error render creator elements in select.component.js: ', error);
            ErrorSweetAlert(error);
      }
}

export async function SelectFilmTags(tagId) {
      try {
            const result = await fetchAPI.Get(apiConfig.endpoints.getFilmTags);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            const tags = result.data;
            RenderSelectElement(tagId, tags, 'tag', 'name');
      } catch(error) {
            console.error('Error render tag element in select.component.js: ', error);
            ErrorSweetAlert(error);
      }
}

function RenderSelectElement(selectId, data, placeholder, value, option) {
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
            ErrorSweetAlert(error);
      }
}


import apiConfig from "../api/api.config.js";
import * as fetchAPI from "../api/fetch.api.js";
import { ErrorSweetAlert } from "../utils/sweetAlert.js";

export async function SelectStudios(studioElement) {
      try {
            const result = await fetchAPI.GetList(apiConfig.endpoints.getStudios);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            
            const studios = result.data;
            const studioSelect = document.getElementById(studioElement);
            studioSelect.innerHTML = '<option value="" disabled selected>Select studio</option>';
            studios.forEach(studio => {
                  const option = document.createElement('option');
                  option.value = studio._id; 
                  option.textContent = studio.name; 
                  studioSelect.appendChild(option);
            });
      } catch(error) {
            console.error('Error render studio elements in select.component.js', error);
            ErrorSweetAlert(error);
      }
}

export async function SelectCodes(codeElement) {
      try {
            const result = await fetchAPI.GetList(apiConfig.endpoints.getCodes);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const codes = result.data;

            const codeSelect = document.getElementById(codeElement);
            codeSelect.innerHTML = '<option value="" disabled selected>Select code</option>';
            codes.forEach(code => {
                  const option = document.createElement('option');
                  option.value = code._id;
                  option.textContent = code.code;
                  codeSelect.appendChild(option);
            });
      } catch(error) {
            console.error('Error render code elements in select.component.js', error);
            ErrorSweetAlert(error);
      }
}

export async function selectCodeByStudio(codeElement, studio_id) {
      try {
            const result = await fetchAPI.GetList(`${apiConfig.endpoints.getCodesByStudio}/${studio_id}`);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const codes = result.data;
            const codeSelect = document.getElementById(codeElement);
            codeSelect.innerHTML = '';

            codes.forEach(code => {
                  const option = document.createElement('option');
                  option.value = code._id;
                  option.textContent = code.code;
                  codeSelect.appendChild(option);
            });
      } catch(error) {
            console.error('Error getting codes by studio: ', error);
      }
}

export async function selectCreators(creatorElement) {
      try {
            const result = await fetchAPI.GetList(apiConfig.endpoints.getCreators);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            
            const studios = result.data;
            const creatorSelect = document.getElementById(creatorElement);
            creatorSelect.innerHTML = '<option value="" disabled selected>Select creator</option>';
            studios.forEach(creator => {
                  const option = document.createElement('option');
                  option.value = creator._id; 
                  option.textContent = creator.name; 
                  creatorSelect.appendChild(option);
            });
      } catch(error) {
            console.error('Error render creator elements in select.component.js', error);
            ErrorSweetAlert(error);
      }
}
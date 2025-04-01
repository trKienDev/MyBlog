import apiConfig from "../api/api.config.js";
import * as fetchAPI from "../api/fetch.api.js";

export async function SelectStudios(studioElement) {
      try {
            const studios = await fetchAPI.GetList(apiConfig.endpoints.getStudios);
            const studioSelect = document.getElementById(studioElement);
            studioSelect.innerHTML = '<option value="" disabled selected>Select studio</option>';
            studios.forEach(studio => {
                  const option = document.createElement('option');
                  option.value = studio._id; 
                  option.textContent = studio.name; 
                  studioSelect.appendChild(option);
            });
      } catch(error) {
            console.error('Error render studio elements in studio.component.js', error);
      }
}
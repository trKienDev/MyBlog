import config2 from "../../../services/config.js";
import { loadContent } from '../../../services/loadElement/loadDynamicPages.js';

export function loadFilm() {
        const btnCreate = document.querySelector(".btn-create"); // Lấy thẻ div với class btn-create
        if (btnCreate) {
                btnCreate.addEventListener("click", function () {
                        const url = "/admin/pages/setting/films/createFilm.html"; // Đường dẫn đến file createFilm.html
                        loadContent(url, "dynamic-data", loadStudios);
                });
        }
}

async function loadStudios() {
        try {
                const response = await fetch(`${config2.domain}${config2.endpoints.studioList}`) ;
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const studios = await response.json();
                const studioSelect = document.getElementById('film-studio');
                studioSelect.innerHTML = '<option value="" disabled selected>Select studio</option>';

                studios.forEach(studio => {
                        const option = document.createElement('option');
                        option.value = studio._id; 
                        option.textContent = studio.name; 
                        studioSelect.appendChild(option);
                });
        } catch (error) {
                console.error('Error loading studios:', error);
        }
}


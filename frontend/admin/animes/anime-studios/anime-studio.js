import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import table_component from "../../../components/table.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";

export function initAnimeStudio() {
      getAnimeStudios();
      createAnimeStudio();
      
}

async function getAnimeStudios() {
      try {
            const tbody = document.querySelector('#anime-studio_table tbody');
            tbody.innerHTML = '';

            const anime_studios = await animes_api.getAnimeStudios();
            anime_studios.forEach(anime_studio => {
                  const row = table_component.createTrWithId(anime_studio._id);
                  
                  const name = table_component.createTextTd({ i_text: anime_studio.name });
                  row.appendChild(name);

                  tbody.appendChild(row);
            });
      } catch(error) {
            console.error('Error getting anime studios: ',error);
            error_sweetAlert(error);
      }
}

async function createAnimeStudio() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const studio = document.getElementById('studio').value;
            const data = { name: studio};
            try {
                  const result = await fetch_api.createJson(`${api_configs.endpoints.createAnimeStudio}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert('anime studio created');
            } catch(error) {
                  console.error('Error creating anime studio: ', error.message);
            }
      });
}
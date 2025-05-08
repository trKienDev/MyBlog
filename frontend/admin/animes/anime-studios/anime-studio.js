import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import { success_sweetAlert } from "../../../utils/sweet-alert.js";

export function initAnimeStudio() {
      createAnimeStudio();
}




async function createAnimeStudio() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const studio = document.getElementById('studio').value;
            const data = { name: studio};
            console.log('data: ', data);
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
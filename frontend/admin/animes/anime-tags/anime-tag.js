import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import table_component from "../../../components/table.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";

export function initAnimeTag() {
      createAnimeTag();
}

async function createAnimeTag() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const tag = document.getElementById('tag').value;
            const kind = document.getElementById('kind').value;
            const data = { name: tag, kind: kind };
            try {
                  const result = await fetch_api.createJson(`${api_configs.endpoints.createAnimeTag}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert('anime tag created');
            } catch(error) {
                  console.error('Error creating anime tag: ', error.message);
            }
      });
}
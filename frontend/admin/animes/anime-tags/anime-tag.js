import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import table_component from "../../../components/table.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";

export function initAnimeTag() {
      getAnimeTags();
      createAnimeTag();
}

async function getAnimeTags() {
      try {
            const tbody = document.querySelector('#anime-tag_table tbody');
            tbody.innerHTML = '';

            const anime_tags = await animes_api.getAnimeTags();
            anime_tags.forEach(anime_tag => {
                  const row = table_component.createTrWithId(anime_tag._id);

                  const name = table_component.createTextTd({ i_text: anime_tag.name });
                  row.appendChild(name);

                  tbody.appendChild(row);
            });
      } catch(error) {
            console.error('Error getting anime tags: ', error);
            error_sweetAlert(error);
      }
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
                  getAnimeTags();
            } catch(error) {
                  console.error('Error creating anime tag: ', error.message);
            }
      });
}
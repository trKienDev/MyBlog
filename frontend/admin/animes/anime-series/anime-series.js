import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import table_component from "../../../components/table.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";

export function initAnimeSeries() {
      getAnimeSeries();
      createAnimeSeries();
}

async function getAnimeSeries() {
      try {
            const tbody = document.querySelector('#anime-series_table tbody');
            tbody.innerHTML = '';

            const anime_series = await animes_api.getAnimeSeries();
            anime_series.forEach(anime_series => {
                  const row = table_component.createTrWithId(anime_series._id);
                  
                  const name = table_component.createTextTd({ i_text: anime_series.name });
                  row.appendChild(name);

                  tbody.appendChild(row);
            });
      } catch(error) {
            console.error('Error getting anime series: ', error);
            error_sweetAlert(error);
      }
}

async function createAnimeSeries() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const series = document.getElementById('series').value;
            const data = { name: series};
            try {
                  const result = await fetch_api.createJson(`${api_configs.endpoints.createAnimeSeries}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert('anime series created');
            } catch(error) {
                  console.error('Error creating anime series: ', error.message);
            }
      });
}
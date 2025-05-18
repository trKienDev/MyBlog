import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import table_component from "../../../components/table.component.js";
import id_selectors from "../../../selectors/element-id.selector.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";

export function initAnimePlaylist() {
      getAnimePlaylists();
      createAnimePlaylist();
}

async function getAnimePlaylists() {
      try {
            const tbody = document.querySelector(`#${id_selectors.table.anime_playlist} tbody`);
            tbody.innerHTML = '';

            const anime_playlists = await animes_api.getAnimePlaylists();
            anime_playlists.forEach(anime_playlist => {
                  const row = table_component.createTrWithId(anime_playlist._id);

                  const name = table_component.createTextTd({ i_text: anime_playlist.name });
                  row.appendChild(name);

                  tbody.appendChild(row);
            });
      } catch(error) {
            console.error('Error getting anime playlists: ', error);
            error_sweetAlert(error);
      }
}

async function createAnimePlaylist() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const playlist = document.getElementById('playlist').value;
            const data = { name: playlist };

            try {
                  const result = await fetch_api.createJson(`${api_configs.endpoints.createAnimePlaylist}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert('anime playlist created');
                  getAnimePlaylists();
            } catch(error) {
                  console.error('Error creating anime playlist: ', error);
                  error_sweetAlert(error);
            }
      });
}
import api_configs from "../../api/api.config.js";
import fetch_api from "../../api/fetch.api.js";
import * as htmlHandler from '../../components/table.component.js';
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";

export function initPlaylistAdmin() {
      renderPlaylists();
      const createPlaylist_form = document.getElementById('form');
      createPlaylist_form.addEventListener('submit', async(event) => {
            createNewPlaylist(event);
      });  
}

async function renderPlaylists() {
      try {
            const tbody = document.querySelector("#playlist-table tbody");
            tbody.innerHTML = '';   

            const result = await fetch_api.apiGet(api_configs.endpoints.getPlaylists);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const playlists = result.data;
            playlists.forEach(collection => {  
                  const row = htmlHandler.createTrWithId(collection._id);

                  const name = htmlHandler.CreateTdTextCell(collection.name);
                  row.appendChild(name);

                  tbody.appendChild(row);
            });   
      } catch(error) {
            console.error('Error getting tags: ', error);
            error_sweetAlert(error);
      }
}

async function createNewPlaylist(event) {
      event.preventDefault();

      const name = document.getElementById('name');
      const data = { name: name.value };

      try {
            const result = await fetch_api.createJson(`${api_configs.endpoints.createPlaylist}`, data);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            success_sweetAlert('playlist created');
            renderPlaylists();
      } catch(error) {
            console.error('Error creating playlist: ', error.message);
            error_sweetAlert(error);
      }
}

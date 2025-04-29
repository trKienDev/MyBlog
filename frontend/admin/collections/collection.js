import api_configs from "../../api/api.config.js";
import * as sweetAlert from "../../utils/sweet-alert.js";
import * as htmlHandler from "../../components/table.component.js";
import fetch_api from "../../api/fetch.api.js";

export function InitCollectionAdmin() {
      CreateNewCollection();
      RenderCollections();
}

async function RenderCollections() {
      try {
            const tbody = document.querySelector("#collection-table tbody");
            tbody.innerHTML = '';

            const result = await fetch_api.apiGet(api_configs.endpoints.getCollections);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const collections = result.data;
            collections.forEach(collection => {  
                  const row = htmlHandler.createTrWithId(collection._id);

                  const name = htmlHandler.CreateTdTextCell(collection.name);
                  row.appendChild(name);

                  tbody.appendChild(row);
            });   
      } catch(error) {
            console.error('Error getting collections: ', error);
            sweetAlert.error_sweetAlert(error);
      }
}

async function CreateNewCollection() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            
            const name = document.getElementById('name');
            const data = { name: name.value} ;

            try {
                  const result = await fetch_api.createJson(`${api_configs.endpoints.createCollection}`, data);

                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  sweetAlert.success_sweetAlert('collection created');
                  RenderCollections();
            } catch(error) {
                  console.error('Error creating collection: ', error.message);
                  sweetAlert.error_sweetAlert(error);
            } 
      });
}
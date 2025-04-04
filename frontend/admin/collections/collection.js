import apiConfig from "../../api/api.config.js";
import * as fetchApi from "../../api/fetch.api.js";
import * as sweetAlert from "../../utils/sweet-alert.js";
import * as htmlHandler from "../../components/table.component.js";

export function InitCollectionAdmin() {
      CreateNewCollection();
      RenderTags();
}

async function RenderTags() {
      try {
            const tbody = document.querySelector("#collection-table tbody");
            tbody.innerHTML = '';

            const result = await fetchApi.GetList(apiConfig.endpoints.getCollections);
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
            console.error('Error getting tags: ', error);
            sweetAlert.ErrorSweetAlert(error);
      }
}

async function CreateNewCollection() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            
            const name = document.getElementById('name');
            const data = { name: name.value} ;

            try {
                  const result = await fetchApi.CreateItemJson(`${apiConfig.endpoints.createCollection}`, data);

                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  sweetAlert.SuccessSweetAlert('collection created');
            } catch(error) {
                  console.error('Error creating collection: ', error.message);
                  sweetAlert.ErrorSweetAlert(error);
            }
      });
}
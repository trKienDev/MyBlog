import apiConfig from "../../api/api.config.js";
import * as fetchApi from "../../api/fetch.api.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweet-alert.js";
import * as htmlHandler from "../../components/table.component.js";

export function initTagAdmin() {
      RenderTags();
      CreateNewTag();
}

async function RenderTags() {
      try {
            const tbody = document.querySelector("#tag-table tbody");
            tbody.innerHTML = '';

            const result = await fetchApi.Get(apiConfig.endpoints.getTags);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            const tags = result.data;
            tags.forEach(tag => {  
                  const row = htmlHandler.createTrWithId(tag._id);

                  const name = htmlHandler.CreateTdTextCell(tag.name);
                  row.appendChild(name);

                  const kind = htmlHandler.CreateTdTextCell(tag.kind);
                  row.appendChild(kind);

                  tbody.appendChild(row);
            });   
      } catch(error) {
            console.error('Error getting tags: ', error);
            ErrorSweetAlert(error);
      }
}

async function CreateNewTag() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const name = document.getElementById('name');
            const kind = document.getElementById('kind');
            const data = { name: name.value, kind: kind.value };
            
            try {
                  const result = await fetchApi.CreateItemJson(`${apiConfig.endpoints.createTag}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }
      
                  SuccessSweetAlert("tag created");
                  RenderTags();
            } catch(error) {
                  console.error('Error creating tag: ', error.message);
                  ErrorSweetAlert(error);
            } finally {
                  name.value = "";
                  kind.value = "";
            }
      })
};


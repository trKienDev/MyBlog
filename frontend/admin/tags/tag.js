import apiConfig from "../../api/api.config.js";
import * as fetchApi from "../../api/fetch.api.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweetAlert.js";
import * as htmlHandler from "../../components/table.component.js";



export function initTagAdmin() {
      RenderTags();
      CreateNewTag();
}


async function RenderTags() {
      try {
            const tbody = document.querySelector("#tag-table tbody");
            tbody.innerHTML = '';

            const tags = await fetchApi.GetList(apiConfig.endpoints.getTags);
            console.log("tags: ", tags);
            tags.forEach(tag => {  
                  console.log("tag: ", tag);
                  const row = document.createElement('tr');
                  row.setAttribute('data-id', tag._id);

                  const name = htmlHandler.CreateTdTextCell(tag.name);
                  row.appendChild(name);

                  const kind = htmlHandler.CreateTdTextCell(tag.kind);
                  row.appendChild(kind);

                  tbody.appendChild(row);
            });   
      } catch(error) {
            console.error('Error getting tags: ', error);
      }
}

async function CreateNewTag() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const kind = document.getElementById('kind').value;
            const data = {
                  name: name,
                  kind: kind,
            };
            
            try {
                  const createdTag = await fetchApi.CreateItemJson(`${apiConfig.endpoints.createTag}`, data);
                  if(createdTag._id) {
                        SuccessSweetAlert("tag created");
                        RenderTags();
                  } else {
                        ErrorSweetAlert("failed to create tag");
                  }
            } catch(error) {
                  console.error('Error creating tag: ', error.message);
                  ErrorSweetAlert("Failed to create tag");
            } 
      })
};


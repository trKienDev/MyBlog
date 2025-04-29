import api_configs from "../../api/api.config.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import * as htmlHandler from "../../components/table.component.js";
import fetch_api from "../../api/fetch.api.js";

export function initTagAdmin() {
      render_tags();
      create_newTag();
}

async function render_tags() {
      try {
            const tbody = document.querySelector("#tag-table tbody");
            tbody.innerHTML = '';

            const result = await fetch_api.apiGet(api_configs.endpoints.getTags);
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
            error_sweetAlert(error);
      }
}

async function create_newTag() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const name = document.getElementById('name');
            const kind = document.getElementById('kind');
            const data = { name: name.value, kind: kind.value };
            
            try {
                  const result = await fetch_api.createJson(`${api_configs.endpoints.createTag}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }
      
                  success_sweetAlert("tag created");
                  render_tags();
            } catch(error) {
                  console.error('Error creating tag: ', error.message);
                  error_sweetAlert(error);
            } finally {
                  name.value = "";
                  kind.value = "";
            }
      })
};


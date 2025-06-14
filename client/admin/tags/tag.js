import api_configs from "../../api/api.config.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import fetch_api from "../../api/fetch.api.js";
import table_component from "../../components/table.component.js";
import tag_api from "../../api/tag.api.js";

export function initTagAdmin() {
      RenderTagsTable();
      CreateNewTag();
      SearchTagByName();
}

      async function RenderTagsTable() {
            try {
                  const tbody = document.querySelector("#tag-table tbody");
                  tbody.innerHTML = '';

                  const tags = await tag_api.getTags();
                  tags.forEach(tag => {  
                        const row = table_component.createTrWithId(tag._id);

                        const name = table_component.createTextTd({ i_text: tag.name });
                        row.appendChild(name);

                        const kind = table_component.createTextTd({ i_text: tag.kind });
                        row.appendChild(kind);

                        tbody.appendChild(row);
                  });   
            } catch(error) {
                  console.error('Error getting tags: ', error);
                  error_sweetAlert(error);
            }
      }

async function CreateNewTag() {
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
                  RenderTagsTable();
            } catch(error) {
                  console.error('Error creating tag: ', error.message);
                  error_sweetAlert(error);
            } finally {
                  name.value = "";
                  kind.value = "";
            }
      })
};

function SearchTagByName() {
      const tagSearchInput = document.getElementById('tag-search_input');
      const tagTableBody = document.getElementById('tag-table_tbody');
      const rows = tagTableBody.getElementsByTagName('tr');

      tagSearchInput.addEventListener('keyup', function() {
            const searchTerm = tagSearchInput.value.toLowerCase(); // Lấy giá trị tìm kiếm và chuyển về chữ thường

            for (let i = 0; i < rows.length; i++) {
                  const row = rows[i];
                  const tagNameCell = row.getElementsByTagName('td')[0]; // Lấy ô đầu tiên (tên tag)

                  if (tagNameCell) {
                        const tagName = tagNameCell.textContent.toLowerCase(); // Lấy tên tag và chuyển về chữ thường

                        if (tagName.includes(searchTerm)) {
                              row.style.display = ''; // Hiển thị hàng nếu tên tag chứa chuỗi tìm kiếm
                        } else {
                              row.style.display = 'none'; // Ẩn hàng nếu không khớp
                        }
                  }
            }
      });
}

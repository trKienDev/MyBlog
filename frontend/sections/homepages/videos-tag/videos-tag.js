import config from "../../../services/config.js";

let tagList = [];
/**
 * Hàm hiển thị danh sách tag ra giao diện
 * @param {Array} tagItems Danh sách tag cần hiển thị
 */

export function loadVideoTags() {
      fetch(`${config.domain}${config.endpoints.tagList}`)
      .then(response => {
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }  
            return response.json();
      })
      .then(tagItems => {
            tagList = tagItems;
            displayTags(tagList);
            searchTag();
      }) 
      .catch(error => {
            console.error("Error fetching tags: ", error);
      });
}

function searchTag() {
      const searchInput = document.getElementById("tag-search");
      if(searchInput) {
            searchInput.addEventListener('input', () => {
                  const searchValue = searchInput.value.trim().toLowerCase();
                  console.log("search value: ", searchValue);
                  const searchedTag = tagList.filter(tag => {
                        return tag.name.toLowerCase().includes(searchValue);
                  });
                  console.log("seachedTag: ", searchedTag);
                  displayTags(searchedTag);
            });
      }
}
function displayTags(list) {
      const tagsContainer = document.querySelector("#tags-container");
      tagsContainer.innerHTML = '';

      const tags_div = document.createElement("div");
      tags_div.classList = "tags";
      tagsContainer.appendChild(tags_div);

      const row_div = document.createElement("div");
      row_div.classList = "row tag-scrollbar";

      list.forEach(item => {
            const tag_div = document.createElement("div");
            tag_div.classList = "tag-item";

            const tagBox_div = document.createElement("div");
            tagBox_div.classList = "tag-box";

            const tag_a = document.createElement("a");
            tag_a.href = `pages/tag/tag.html?tag=${item.name}&id=${item._id}`;
            tag_a.textContent = item.name;
            tag_a.classList.add("tag-name");

            tagBox_div.appendChild(tag_a);
            tag_div.appendChild(tagBox_div);
            row_div.appendChild(tag_div);
      });

      tags_div.appendChild(row_div);
      tagsContainer.appendChild(tags_div);
}





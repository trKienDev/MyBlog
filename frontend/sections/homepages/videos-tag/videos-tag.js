import config from "../../../services/config.js";

export function loadVideoTags() {
      fetch(`${config.domain}${config.endpoints.tagList}`)
      .then(response => {
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }  
            return response.json();
      })
      .then(tagItems => {
            const tagsContainer = document.querySelector("#tags-container");
            tagsContainer.innerHTML = '';
            
            const tags_div = document.createElement("div");
            tags_div.classList = "tags";
            tagsContainer.appendChild(tags_div);

            const row_div = document.createElement("div");
            row_div.classList = "row";

            tagItems.forEach(item => {
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
      })
}
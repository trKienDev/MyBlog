import * as fetchAPI from "../api/fetch.api.js";

export async function InitSelectSearch(elmentId, endpoint, value) {
      const list = await GetSelectList(endpoint);
      CreateSelectSearchElement(elmentId, list, value);
}
 
async function GetSelectList(endpoint) {
      const result = await fetchAPI.GetList(endpoint);
      if(result.success === false) {
            throw new Error(result.error);
      }
      const list = result.data;
      return list;
}

function CreateSelectSearchElement(elmentId, list, value) {
      const elementId = document.querySelector(`#${elmentId}`),
      wrapper = elementId.querySelector(".wrapper"),
      selectBtn = wrapper.querySelector(".select-btn"),
      searchInput = wrapper.querySelector("input"),
      options = wrapper.querySelector(".options");
      
      RenderList(list, value, options, null);

      selectBtn.addEventListener("click", () => {
            wrapper.classList.toggle("active");
      });

      AttachSearchInputHandler(list, value, searchInput, options);

      HandleSelectionOption(list, value, options, selectBtn, wrapper);
}

function RenderList(list, value, options, selectedItem) {
      options.innerHTML = list.map(item => {
            const selectedClass = item[value] === selectedItem ? "selected" : "";
            return `<li value="${item._id}" class="${selectedClass}">${item[value]}</li>`;
      }).join("");
}

function AttachSearchInputHandler(list, value, searchInput, options) {
      searchInput.addEventListener("keyup", () => {
            const filtered = FilterOption(list, value, searchInput);
            options.innerHTML = filtered.length ? filtered.map(item => `<li value="${item._id}" >${item[value]}</li>`).join("")
                                                                        : `<p style="color: red; padding-left: 20px;">Oops! not found anything</p>`;
      });

      return searchInput;
}

function FilterOption(list, value, searchInput) {
      const searchValue = searchInput.value.toLowerCase();
      const filteredOption = list.filter(item => 
            item[value].toLowerCase().startsWith(searchValue)
      );

      return filteredOption;
}

function HandleSelectionOption(list, value, options, button, wrapper) {
      options.addEventListener("click", (e) => {
            if (e.target && e.target.nodeName === "LI") {
                  const selectedOption = e.target;
                  const span = button.querySelector("span");
                  span.innerText = selectedOption.innerText;
                  span.setAttribute("item-id", selectedOption.getAttribute("value"));
                  wrapper.classList.remove("active");

                  RenderList(list, value, options, selectedOption);
            }
      });
}

export function getSelectedOptionId(selectId) {
      const studioSelection = document.querySelector(`#${selectId} .select-btn span`);
      const selectedStudioId = studioSelection.getAttribute("item-id");
      return selectedStudioId;
}
import fetch_api from "../api/fetch.api.js";
import { showToast } from "../utils/toast-notification.js";

export async function initSelectSearch(elment_id, endpoint, value) {
      const list = await getSelectList(endpoint);
      createSelectSearchElement(elment_id, list, value);
}
 
async function getSelectList(endpoint) {
      const result = await fetch_api.apiGet(endpoint);
      if(result.success === false) {
            throw new Error(result.error);
      }
      const list = result.data;
      return list;
}

function createSelectSearchElement(elment_id, list, value) {
      const element_id = document.querySelector(`#${elment_id}`),
      wrapper = element_id.querySelector(".wrapper"),
      select_btn = wrapper.querySelector(".select-btn"),
      search_input = wrapper.querySelector("input"),
      options = wrapper.querySelector(".options");

      renderList(list, value, options, null);

      select_btn.addEventListener("click", () => {
            wrapper.classList.toggle("active");
      });

      attachSearchInput(list, value, search_input, options);

      handleSelectionOption(list, value, options, select_btn, wrapper);
}

function renderList(list, value, options, selected_item) {
      options.innerHTML = list.map(item => {
            const selected_class = item[value] === selected_item ? "selected" : "";
            return `<li value="${item._id}" class="${selected_class}">${item[value]}</li>`;
      }).join("");
}

function attachSearchInput(list, value, search_input, options) {
      search_input.addEventListener("keyup", () => {
            const filtered = filterOptions(list, value, search_input);
            options.innerHTML = filtered.length ? filtered.map(item => `<li value="${item._id}" >${item[value]}</li>`).join("")
                                                                        : `<p style="color: red; padding-left: 20px;">Oops! not found anything</p>`;
      });

      return search_input;
}

function filterOptions(list, value, search_input) {
      const search_value = search_input.value.toLowerCase();
      const filtered_option = list.filter(item => 
            item[value].toLowerCase().startsWith(search_value)
      );

      return filtered_option;
}

function handleSelectionOption(list, value, options, button, wrapper) {
      options.addEventListener("click", (e) => {
            if (e.target && e.target.nodeName === "LI") {
                  const selected_option = e.target;
                  const span = button.querySelector("span");
                  span.innerText = selected_option.innerText;
                  span.setAttribute("item-id", selected_option.getAttribute("value"));
                  wrapper.classList.remove("active");

                  renderList(list, value, options, selected_option);
            }
      });
}

/**
 * Lấy giá trị option từ dropdown custom.
 * @param {string} selectId ID của container select
 * @param {'id'|'text'} option - 'id' để lấy item-id, 'text' để lấy innerText
 * @returns {string|null} Giá trị tương ứng hoặc null nếu không tìm thấy
 */
export function getSelectedOptionValue(select_id, option) {
      const span = document.querySelector(`#${select_id} .select-btn span`);
      if(!span) return null;

      switch(option) {
            case 'id': return span.getAttribute('item-id');
            case 'text': return span.innerText.trim();
            default:    
                  showToast('Unexpected error', 'error');
                  console.warn(`Unsupported option "${option}'`);
                  return null;
      }
}

export function resetSelectSearch(configs) {
      configs.forEach(({ id, placeholder }) => {
            const studioSelect_element = document.getElementById(id),
            select_btn = studioSelect_element.querySelector(".select-btn"),
            span = select_btn.querySelector("span");
            span.removeAttribute("item-id");
            span.innerText = placeholder;
      });     
      
}

export async function loadInfoSelectSearch(film, element_id, field_id, getFunc) {
      const el = document.getElementById(element_id);
      const span = el.querySelector('span');
      span.setAttribute('item-id', film[field_id]);
      span.innerText = await getFunc(film[field_id]);
}
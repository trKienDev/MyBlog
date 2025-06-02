import div_component from "./div.component.js";

async function displaySelectedOptions({ selectSearchContainer_id, selectedOption_class, selectElement_id }) {
      const multiSelectedSearch_container = document.getElementById(selectSearchContainer_id);
      if(!multiSelectedSearch_container) {
            console.error('Error in displaySelectedSearchOption: multiSelectedSearch_container not found!');
            showToast('multiSelectedSearch_container not found!', error);
            return;
      } 

      multiSelectedSearch_container.addEventListener('click', (event) => {
            if(event.target.classList.contains(selectedOption_class)) {
                  event.target.remove();
            }
      });

      if(!selectElement_id) {
            console.error('Error in displaySelectedOptions: selectElement_id not found!');
            showToast('selectElement_id not found!', error);
            return;
      }
      observeSelectChange(selectElement_id, ({ option_id, option_name}) => {
            const existed_option = Array.from(multiSelectedSearch_container.children).some(child => 
                  child.innerText === option_name || child.getAttribute('value') === option_id
            );
            if(!existed_option) {
                  const tag_div = div_component.createDiv({ 
                        icss_class: selectedOption_class, 
                        idiv_id: option_id, 
                        idiv_name: option_name
                  });
                  multiSelectedSearch_container.appendChild(tag_div);
            }
      });
}

function observeSelectChange(selectElement_id, callback) {
      const span = document.querySelector(`#${selectElement_id} .select-btn span`);
      if(!span) {
            console.error('Error in obserSelectChange: span not found!');
            showToast('span not found!', error);
            return;
      }

      const observer = new MutationObserver((mutations_ist) => {
            for(const mutation of mutations_ist) {
                  if (mutation.type === 'attributes' && mutation.attributeName === 'item-id') {
                        const option_id = span.getAttribute('item-id');
                        const option_name = span.textContent.trim();
                        if(option_id && option_name) {
                              callback({ option_id, option_name});
                        }
                  }
            }
      });

      observer.observe(span, {
            attributes: true,    
            childList: true,       
            characterData: true, 
            subtree: true     
      });

      return observer;
}

function getSelectedOptions(container_id, css_class) {
      const select_container = document.getElementById(container_id);
      const select_nodes = select_container.querySelectorAll(`.${css_class}`);
      return Array.from(select_nodes).map(select => select.getAttribute('id'));
}

/**
 * Lấy thông tin tag rồi tạo div và append vào container
 * @param {string[]} tagIds  Mảng các _id của tag
 * @param {HTMLElement} container  Phần tử DOM chứa các tag
 */
async function renderSelectedOptions(option_ids, container, getOptionByIdFunc) {
      for (const option_id of option_ids) {
            const option = await getOptionByIdFunc(option_id);
            const option_div = div_component.createDiv({
                  icss_class: 'selected-option',
                  idiv_id:    option._id,
                  idiv_name:  option.name
            });
            // 3. Gắn vào container
            container.appendChild(option_div);
      }
}

function resetMultiSelection(container_id) {
      const select_container = document.getElementById(container_id);
      select_container.innerHTML = '';
}

const multiSelectSearch_component = {
      displaySelectedOptions,
      getSelectedOptions,
      renderSelectedOptions,
      resetMultiSelection,
}
export default multiSelectSearch_component;
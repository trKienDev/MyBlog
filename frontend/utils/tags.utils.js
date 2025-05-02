import div_component from "../components/div.component.js";
import css_selectors from "../selectors/css.selectors.js";
import { showToast } from "./toast-notification.js";

async function displaySelectedTag(container_id, css_class, select_id) {
      const selectedTag_container = document.getElementById(container_id);
      if(!selectedTag_container) {
            console.error('Error in displaySelectedTag: selectedTag_container not found!');
            showToast('selectedTag_container not found!', error);
            return;
      } 

      selectedTag_container.addEventListener('click', (event) => {
            if(event.target.classList.contains(css_selectors.tags.selected_tag)) {
                  event.target.remove();
            }
      });

      if(!select_id) {
            console.error('Error in displaySelectedTag: select_id not found!');
            showToast('select_id not found!', error);
            return;
      }
      observeSelectChange(select_id, ({ tag_id, tag_name}) => {
            const existTag = Array.from(selectedTag_container.children).some(child => 
                  child.innerText === tag_name || child.getAttribute('value') === tag_id
            );
            if(!existTag) {
                  const tag_div = div_component.createDiv({ icss_class: css_class, idiv_id: tag_id, idiv_name: tag_name});
                  selectedTag_container.appendChild(tag_div);
            }
      });
}

function observeSelectChange(select_id, callback) {
      const span = document.querySelector(`#${select_id} .select-btn span`);
      if(!span) {
            console.error('Error in obserSelectChange: span not found!');
            showToast('span not found!', error);
            return;
      }

      const observer = new MutationObserver((mutations_ist) => {
            for(const mutation of mutations_ist) {
                  if (mutation.type === 'attributes' && mutation.attributeName === 'item-id') {
                        const tag_id = span.getAttribute('item-id');
                        const tag_name = span.textContent.trim();
                        if(tag_id && tag_name) {
                              callback({ tag_id, tag_name});
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

const tags_utils = {
      displaySelectedTag,
}
export default tags_utils;
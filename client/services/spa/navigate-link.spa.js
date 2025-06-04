import { showToast } from "../../utils/toast-notification.js";
import spa_renderHTML from "./render-html.js";

function navigateLink(link_id, section_id, endpoint, callback = () => {}) {
      const link_element = document.getElementById(link_id);
      if (link_element) {
            if (!link_element.hasAttribute('data-navigate-initialized')) {
                  link_element.addEventListener('click', event => {
                        event.preventDefault();
                        spa_renderHTML.loadContentFromUrl(endpoint, section_id, callback);
                  });
                  link_element.setAttribute('data-navigate-initialized', 'true'); 
            }
      } else {
            console.error(`Element with id: "${link_id}" not found`);
      }
}

function navigateAnchorLink(a_href, section_id, endpoint, callback = () => {}) {
      const anchor_link = document.querySelector(`a[href=${a_href}]`);
      if(anchor_link) {
            if (!anchor_link.hasAttribute('anime-navigate-initialized')) {
                  anchor_link.addEventListener('click', event => {
                        event.preventDefault();
                        spa_renderHTML.loadContentFromUrl(endpoint, section_id, callback);
                  });
                  anchor_link.setAttribute('anime-navigate-initialized', 'true'); 
            }
      }
};

function navigateMediaLink(event, anchor_element) {
      event.preventDefault();

      const a_href = anchor_element.getAttribute('href');

      try {
            const link_parts = a_href.split('/');
            if (link_parts.length < 2 || !link_parts[1].startsWith('#id=')) {
                  console.error("Invalid href format for media link navigation:", a_href);
                  showToast("Invalid href format for media link navigation", 'error');
                  return;
            }

            const prefix = link_parts[0];
            const id_part = link_parts[1];
            const media_id = id_part.substring(4); 
            
            if (!media_id) {
                  console.error("Could not extract media id:", a_href);
                  showToast('Error', 'error');
                  return;
            }

            spa_renderHTML.loadMediaPages(prefix, media_id, true);
      } catch(error) {
            console.error("An error occurred during media link navigation:", error);
            showToast("Error navigating media link", "error");
      }
}

const spa_navigation = {
      navigateLink,
      navigateAnchorLink,
      navigateMediaLink,
}
export default spa_navigation;
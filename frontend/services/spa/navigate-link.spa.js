import loadDynamicSection_service from "./load-dynamic-section.spa.js";

function spaNavigateLink(link_id, section_id, endpoint, callback = () => {}) {
      const link_element = document.getElementById(link_id);
      if (link_element) {
                  if (!link_element.hasAttribute('data-navigate-initialized')) {
                  link_element.addEventListener('click', event => {
                        event.preventDefault();
                        loadDynamicSection_service.loadContentFromUrl(endpoint, section_id, callback);
                  });
                  link_element.setAttribute('data-navigate-initialized', 'true'); 
            }
      } else {
            console.error(`Element with id: "${link_id}" not found`);
      }
}

const spa_navigation = {
      spaNavigateLink,
}
export default spa_navigation;
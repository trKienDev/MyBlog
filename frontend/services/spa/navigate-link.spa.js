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

const spa_navigation = {
      navigateLink,
      navigateAnchorLink,
}
export default spa_navigation;
import api_configs from '../../../api/api.config.js';
import { showToast } from '../../../utils/toast-notification.js';
import { router_config } from '../../config/router.config.js';
import ElementsId from '../../constants/element-id.constant.js';

/**
 * Tải nội dung media dựa trên prefix và id, và tùy chọn cập nhật URL.
 * @param {string} prefix - Loại media ('video', 'manga',...).
 * @param {string} media_id - ID của media.
 * @param {boolean} [shouldPushState=true] - Có thực hiện pushState hay không.
 */
function loadMediaPages(prefix, media_id, shouldPushState = true) {
      const mediaRouter_config = router_config[prefix];

      if (mediaRouter_config) {
            const config = mediaRouter_config(media_id);
            const pushState_options = shouldPushState ? { url: config.url, state: config.state, title: config.title } : null; // <-- Quan trọng: truyền null nếu không muốn push

            loadContentFromMediaUrl(
                  config.endpoint,
                  ElementsId.PAGECONTENT,
                  pushState_options,
                  () => { console.log(`Loaded ${prefix} with id: ${media_id}`); }
            );
      } else {
            console.warn("Unhandled prefix:", prefix);
      }
}

function loadContentFromMediaUrl(endpoint, section_element, pushState_data, callback = () => {}) {
      spa_renderHTML.loadContentFromUrl(endpoint, section_element, () => {
            if(pushState_data && pushState_data.url) {
                  try {
                        window.history.pushState( pushState_data.state || null, pushState_data.title || '', pushState_data.url);
                        console.log(`URL updated to: ${pushState_data.url}`);
                  } catch(pushState_error) {
                        console.error('Error calling pushState:', pushState_error);
                        showToast('Error updating url', 'error');
                  }
            }
            callback();
      });
}

function loadContentFromUrl(endpoint, section_element, callback = () => {}) {
      try {
            const url = `${api_configs.client}${endpoint}`;
            loadContent(url, section_element, callback);
      } catch(error) {
            console.error('Error load dynamic section: ', error);
            showToast(error, 'error');
      }
}

async function loadContent(url, dynamicData_id = 'dynamic-section', callback) {
      try {
            const response = await fetch(url);
            if(!response.ok) {
                  throw new Error(`Failed to fetch page: ${response.status}`);
            }

            const html = await response.text();
            const dynamicData_element = document.getElementById(dynamicData_id);
            if (dynamicData_element) {
                  dynamicData_element.innerHTML = ''; 
                  dynamicData_element.innerHTML = html; 
                  
                  const scripts = dynamicData_element.querySelectorAll('script');
                  scripts.forEach(script => {
                        const new_script = document.createElement('script');
                        new_script.textContent = script.textContent;
                        document.body.appendChild(new_script);
                        document.body.removeChild(new_script);
                  });

                  if (callback && typeof callback === 'function') {
                        callback();
                  }
            } else {
                  console.error(`Element with ID ${dynamicData_id} does not exist`);
                  showToast(`Element with ID ${dynamicData_id} does not exist`, 'error');
            }
      } catch(error) {
            showToast(error, 'error');
            throw new Error(error);
      }
}

const spa_renderHTML = {
      loadContentFromUrl,
      loadContentFromMediaUrl,
      loadMediaPages,
}
export default spa_renderHTML;
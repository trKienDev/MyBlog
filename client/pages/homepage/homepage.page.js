import ClientSections from "../../constants/client-sections.constant.js";
import ElementsId from "../../constants/element-id.constant.js";
import spa_renderHTML from "../../services/spa/render-html.js";
import activeState_utils from "../../utils/active-state.js";
import videoPagination_section from "../../sections/pagination-videos/pagination-videos.section.js";
import { showToast } from "../../utils/toast-notification.js";



export function HomePageController() {
      FetchNextRandomBatch();
      activeState_utils.InitializeActiveState('sidebar-item', (activatedSidebar) => {
            HandleActiveSidebar(activatedSidebar);
      });
}

async function HandleActiveSidebar(selected_sidebar) {
      
}

let seen_types = ['videos', 'films'];
let is_loading = false;

const feeds_loader = document.getElementById('homepage-feed-loader');

const FetchNextRandomBatch = async () => {
      if(is_loading) return;
      is_loading = true;

      // Chuyển mảng thành một chuỗi, ví dụ: "videos,films"
      const seenTypesQuery = seen_types.join(',');

      try {
            // Gọi API & gửi các types đã thấy
      } catch(error) {
            console.error('Failed to fetch more content: ', error);
            showToast(error, 'error');
      } finally {
            is_loading = false;
      }
}


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

function navigateMediaLink(event) {
      event.preventDefault();
      
      const anchor_element = event.currentTarget;
      const a_href = anchor_element.getAttribute('href');

      try {
            const link_parts = a_href.split('/');
            console.log('nedia type: ', link_parts);
            if (link_parts.length < 2 || !link_parts[1].startsWith('#id=')) {
                  console.error("Invalid href format for media link navigation:", a_href);
                  showToast("Invalid href format for media link navigation", 'error');
                  // Có thể chuyển hướng sang link gốc hoặc báo lỗi
                  // window.location.href = a_href; 
                  return;
            }

            const prefix = link_parts[0];
            const id_part = link_parts[1];
            
            const video_id = id_part.substring(4); // Lấy phần sau '#id='
            if (!video_id) {
                  console.error("Could not extract video ID:", a_href);
                  return;
            }
            
            if (prefix === 'video') {
                  // --- 4. Tải nội dung trang & Gọi API ---
                  // Giả sử bạn có một endpoint/file HTML cho trang xem video
                  // và một ID cho khu vực nội dung chính, ví dụ: 'main-content'
                  const videoPageEndpoint = 'pages/play-video.html'; // Thay bằng endpoint/path thực tế
                  const mainContentId = 'main-content'; // Thay bằng ID khu vực chính

                  spa_renderHTML.loadContentFromUrl(videoPageEndpoint, mainContentId, async () => {
                        console.log("Video page content loaded. Fetching API...");
                        try {
                              // Gọi API (Bạn cần tự định nghĩa hàm này)
                              const videoInfo = await fetchVideoDetails(videoId); 

                              // Hiển thị thông tin video lên trang (Bạn cần tự định nghĩa hàm này)
                              displayVideoPlayer(videoInfo); 

                              // --- 5. Cập nhật URL ---
                              const newUrl = `/watch?video=${videoId}`;
                              const state = { page: 'watch', videoId: videoId };
                              const title = `Watching ${videoInfo.title || videoId}`; // Lấy title từ API nếu có

                              window.history.pushState(state, title, newUrl);
                              console.log(`URL updated to: ${newUrl}`);

                        } catch (apiError) {
                              console.error("Error fetching or displaying video data:", apiError);
                              showToast("Không thể tải thông tin video.", "error");
                              // Hiển thị lỗi trên trang play-video đã tải
                        }
                  });

            } else {
            console.warn("Unhandled prefix:", prefix);
            // Xử lý các prefix khác hoặc hành vi mặc định
            }
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
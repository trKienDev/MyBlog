import short_api from "../../api/short.api";

let current_page = 1;
const limit = 12;
let is_loading = false;
let hasMoreShorts = true;

async function loadMoreVideos(element_id, filters = {}) {
      // 1> Kiểm tra nếu đang tải hoặc đã hết video thì ko làm gì cả
      if(is_loading || !hasMoreShorts) {
            return;
      }

      // 2> Đặt cờ đang tải & hiển thị icon loading
      is_loading = true;
      document.getElementById('short-loader').style.display = 'block';
      try {
            const result = await short_api.GetShortsPaginated({ page: current_page, limit: limit, filters: filters});
            const shorts = result.shorts;
            const pagination = result.pagination;

            if(shorts && shorts.length > 0) {
                  // HIỂN THỊ VIDEO LÊN GIAO DIỆN
                  const short_promises = videos.map(video => createVideoArticle(video));
                  const video_articles = await Promise.all(video_promises);

                  const newVideos_div = document.getElementById(element_id);
                  video_articles.forEach(article => newVideos_div.appendChild(article));
                  current_page++;
                  const totalLoad = pagination.page * pagination.limit;
                  if(totalLoad >= pagination.total) {
                        hasMoreVideos = false;
                        document.getElementById('video-loader').innerHTML = 'Bạn đã xem hết video';
                  }
            } else {
                  hasMoreVideos = false;
                  document.getElementById('video-loader').innerHTML = 'Bạn đã xem hết video';
            }
      } catch(error) {
            console.error('Error getting videos: ', error);
            showToast('Error getting videos', 'error');
      } finally {
            is_loading = false;
      }
}

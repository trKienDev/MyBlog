import animes_api from "../../api/anime.api";
import { showToast } from "../../utils/toast-notification";

let current_page = 1;
const limit = 12;
let is_loading = false;
let hasMoreVideos = true;

async function LoadMoreAnimeVideos(element_id, filters = {}) {
      // 1> Kiểm tra nếu đang tải hoặc đã hết video thì ko làm gì cả
      if(is_loading || !hasMoreVideos) {
            return;
      }

      // 2> Đặt cờ đang tải & hiển thị icon loading
      is_loading = true;
      document.getElementById('video-loader').style.display = 'block';

      try {
            const result = await animes_api.GetUniqueVideosPagination({ page: current_page, limit: limit, filters: filters});
            console.log('result: ', result);
      } catch(error) {
            console.error('Error getting videos: ', error);
            showToast('Error getting videos', 'error');
      } finally {
            is_loading = false;
      }
}

async function AnimeVideosPaginationSectionController(element_id, initial_filters = {}) {
      console.log("Khởi tạo tính năng Tải vô hạn cho video...");

      const active_filters = initial_filters;

      // --- Thiết lập trạng thái ban đầu ---
      // (Đảm bảo các biến này được reset nếu cần)
      is_loading = false;
      hasMoreVideos = true;
      current_page = 1;

      // Xóa các video cũ để tránh trùng lặp nếu hàm được gọi lại
      document.getElementById(element_id).innerHTML = '';

      // --- BƯỚC 1: THIẾT LẬP "NGƯỜI GIÁM SÁT" KHI CUỘN ---
      // Lấy phần tử loader ở cuối trang
      const loader = document.getElementById('video-loader');
      if (!loader) {
            console.error("Không tìm thấy phần tử #video-loader.");
            return;
      }
      loader.style.display = 'block';
      // bổ sung sau
      // loader.innerHTML = '<div class="spinner"></div>'; // Ví dụ icon loading

      // Tạo một IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
            // entries[0] chính là phần tử loader của chúng ta
            const firstEntry = entries[0];
            
            // Nếu loader đi vào trong màn hình (isIntersecting = true)
            // và chúng ta không đang trong quá trình tải (is_loading = false)
            if (firstEntry.isIntersecting && !is_loading) {
            // Thì gọi hàm để tải thêm video
                  console.log("Đã cuộn đến cuối, đang tải thêm...");
                  loadMoreVideos(element_id, active_filters); // <-- GỌI LẦN THỨ 2, 3, 4...
            }
      }, {
            root: null, // Quan sát so với viewport của trình duyệt
            threshold: 0.1 // Kích hoạt khi 10% của loader hiện ra
      });

      // Bắt đầu quan sát phần tử loader
      observer.observe(loader);

      // --- BƯỚC 2: TẢI DỮ LIỆU LẦN ĐẦU TIÊN ---
      // Gọi hàm này ngay lập tức để tải trang 1 mà không cần chờ người dùng cuộn.
      console.log("Đang tải loạt video đầu tiên...");
      console.log('active_filters: ', active_filters);
      LoadMoreAnimeVideos(element_id, active_filters); // <-- GỌI LẦN ĐẦU TIÊN
}
import { api_user } from "../../api/endpoint.api.js";
import app_configs from "../../config/app.config.js";
import activeState_utils from "../../utils/active-state.js";
import { showToast } from "../../utils/toast-notification.js";

let sectionPages = {
      videos: 1, 
      films: 1, 
      creators: 1, 
      anime_videos: 1,
      anime_thumbnails: 1,
      mangas_images: 1, 
      manga_thumbnails: 1, 
      idols: 1, 
      images: 1, 
      shorts: 1, 
      records: 1
}
let is_loading = false;

// Danh sách các loại section muốn xoay vòng trên trang chủ
const homepageSectionTypes = ['videos',  'films', 'images', 'creators', 
      // 'animes_videos', 
      // 'animes_thumbnails', 'mangas', 'manga_thumbnails', 
      // 'idols', 'images', 'shorts', 'records'
];

export function HomePageController() {
      // phần tử loader ở cuối trang, khi nó xuất hiện, ta sẽ tải thêm
      const loader_element = document.getElementById('homepage-feeds-loader');
      if(!loader_element) {
            console.error('#homepage-feeds-loader not found');
            showToast('#homepage-feeds-loader not found', 'error');
            return;
      }

      FetchHomepageBatch(loader_element);
      // Bắt đầu theo dõi phần tử loader
      observer.observe(loader_element);

      activeState_utils.InitializeActiveState('sidebar-item', (activatedSidebar) => {
            HandleActiveSidebar(activatedSidebar);
      });
}

async function HandleActiveSidebar(selected_sidebar) {
      
}

// --- Thiết lập IntersectionObserver ---
const observer = new IntersectionObserver((entries) => {
      // Nếu loaderElement xuất hiện trong màn hình
      if (entries[0].isIntersecting) {
            console.log('fetch homepage batch');
            FetchHomepageBatch(entries[0].target);
      }
}, {
      rootMargin: '200px' // Bắt đầu tải khi còn cách loader 200px
});


const FetchHomepageBatch = async (loader_element) => {
      // nếu đang tải rồi thì ko làm gì cả
      if(is_loading) return;
      is_loading = true;
      loader_element.style.display = 'block' // hiện icon loading (tùy chọn)

      // 1. Chọn ngẫu nhiên 1 loại nội dung từ danh sách
      const randomType = homepageSectionTypes[Math.floor(Math.random() * homepageSectionTypes.length)];
      // 2. Lấy số trang tiếp theo 
      const nextPage = sectionPages[randomType] || 1;
      // 3. Xây dựng URL mới
      const apiUrl = `${app_configs.SERVER}${api_user.fetchSectionData}?type=${randomType}&page=${nextPage}&limit=4`;
      console.log('api url: ', apiUrl);

      try {
            const response = await fetch(apiUrl);
            if(!response.ok) {
                  const error = await response.json();
                  showToast(error.error, 'error');
                  throw new Error('Error HTTP: ', error.error);
            }
            const newContent = await response.json();
            console.log('new content: ', newContent);
            if(newContent.data && newContent.data.length > 0) {
                  const sectionToRender = {
                        type: randomType,
                        title: `More ${randomType}`,
                        data: newContent.data
                  };
                  console.log('sectionToRender: ', [sectionToRender]);
                  RenderNewSections([sectionToRender]);
                  sectionPages[randomType]++;
            }
      } catch(error) {
            console.error("Error fetching homepage feeds: ", error);
            showToast(error, 'error');
      } finally {
            is_loading = false;
            // loader_element.style.display = 'none';
      }
}



function RenderNewSections(sections) {
      const container = document.getElementById('homepage-feeds-content');
      sections.forEach(section => {
            console.log('section: ', section);
            // Đây là nơi bạn sẽ viết logic để chuyển dữ liệu JSON thành HTML
            // Ví dụ đơn giản:
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'homepage-section';
            sectionDiv.innerHTML = `<h2>${section.title}</h2><p>Loại: ${section.type}, có ${section.data.length} mục.</p>`;
            container.appendChild(sectionDiv);
      });
}


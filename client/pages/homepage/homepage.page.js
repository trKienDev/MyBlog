// import creator_api from "../../api/creator.api.js";
// import { api_user } from "../../api/endpoint.api.js";
// import { film_api } from "../../api/film.api.js";
// import doms_component from "../../components/doms.component.js";
// import film_component from "../../components/films.component.js";
// import images_component from "../../components/image.component.js";
// import videos_component from "../../components/videos.component.js";
// import app_configs from "../../config/app.config.js";
// import { ServerFolders } from "../../constants/folders.constant.js";
// import activeState_utils from "../../utils/active-state.js";
// import { showToast } from "../../utils/toast-notification.js";

// let seenIds = {};
// let sectionPages = {
//       videos: 1, 
//       films: 1, 
//       creators: 1, 
//       anime_videos: 1,
//       anime_thumbnails: 1,
//       mangas_images: 1, 
//       manga_thumbnails: 1, 
//       idols: 1, 
//       images: 1, 
//       shorts: 1, 
//       records: 1
// }
// let is_loading = false;

// // Danh sách các loại section muốn xoay vòng trên trang chủ
// const homepageSectionTypes = [
//       'videos', 
//       // 'films', 
//       //'videos', 'films', 
//       // 'images', 'creators', 
//       // 'animes_videos', 
//       // 'animes_thumbnails', 'mangas', 'manga_thumbnails', 
//       // 'idols', 'images', 'shorts', 'records'
// ];
// // Khởi tạo các Set để lưu ID cho mỗi loại.
// // Dùng Set giúp tự động xử lý việc trùng lặp và truy vấn nhanh.
// homepageSectionTypes.forEach(type => {
//       seenIds[type] = new Set();
// });

export function HomePageController() {
//       // phần tử loader ở cuối trang, khi nó xuất hiện, ta sẽ tải thêm
//       const loader_element = document.getElementById('homepage-feeds-loader');
//       if(!loader_element) {
//             console.error('#homepage-feeds-loader not found');
//             showToast('#homepage-feeds-loader not found', 'error');
//             return;
//       }

//       LoadContentUntilScrollable(loader_element);
//       // Bắt đầu theo dõi phần tử loader
//       observer.observe(loader_element);

//       activeState_utils.InitializeActiveState('sidebar-item', (activatedSidebar) => {
//             HandleActiveSidebar(activatedSidebar);
//       });
}

// async function HandleActiveSidebar(selected_sidebar) {
      
// }

// // --- Thiết lập IntersectionObserver ---
// const observer = new IntersectionObserver((entries) => {
//       // Nếu loaderElement xuất hiện trong màn hình
//       if (entries[0].isIntersecting) {
//             FetchHomepageBatch(entries[0].target);
//       }
// }, {
//       rootMargin: '200px' // Bắt đầu tải khi còn cách loader 200px
// });

// async function LoadContentUntilScrollable(loader_element) {
//       // Gọi fetch lần đầu tiên
//       await FetchHomepageBatch(loader_element);

//       // Sau lần fetch đầu tiên, kiểm tra xem có cần fetch tiếp không
//       // Vòng lặp sẽ tiếp tục chừng nào nội dung còn ngắn VÀ chúng ta không đang trong một tiến trình tải khác
//       while (document.body.scrollHeight <= window.innerHeight && !is_loading) {
//             const hasMore = await FetchHomepageBatch(loader_element);
//             if (!hasMore) {
//                   break;
//             }
//       }
// }

// const FetchHomepageBatch = async (loader_element) => {
//       // nếu đang tải rồi thì ko làm gì cả
//       if(is_loading) return;
//       is_loading = true;
//       loader_element.style.display = 'block' // hiện icon loading (tùy chọn)

//       // 1. Chọn ngẫu nhiên 1 loại nội dung từ danh sách
//       const randomType = homepageSectionTypes[Math.floor(Math.random() * homepageSectionTypes.length)];
//       // Lấy danh sách ID đã xem của loại nội dung này.
//       const idsToExclude = Array.from(seenIds[randomType]);
//       // Dùng URLSearchParams để xây dựng query string một cách an toàn.
//       const params = new URLSearchParams({ type: randomType });
//       if (idsToExclude.length > 0) {
//             // Nối các ID thành một chuỗi, phân cách bằng dấu phẩy.
//             params.append('excludedIds', idsToExclude.join(','));
//       }
//       // 3. Xây dựng URL mới
//       const apiUrl = `${app_configs.SERVER}${api_user.fetchSectionData}?${params.toString()}`;
//       console.log('api url: ', apiUrl);
//       let hasMoreContent = false; 

//       try {
//             const response = await fetch(apiUrl);
//             if(!response.ok) {
//                   const error = await response.json();
//                   showToast(error.error, 'error');
//                   throw new Error('Error HTTP: ', error.error);
//             }
//             const newContent = await response.json();
//             console.log('new content: ', newContent);
//             if(newContent.data && newContent.data.length > 0) {
//                   const sectionToRender = {
//                         type: randomType,
//                         title: randomType,
//                         data: newContent.data
//                   };
//                   RenderNewSections([sectionToRender]);
                  
//                   newContent.data.forEach(item => {
//                         // Giả sử mỗi mục trong `data` đều có thuộc tính `_id`
//                         if (item._id) {
//                               seenIds[randomType].add(item._id);
//                         }
//                   });

//                   hasMoreContent = true // đã tải được nội dung
//             } 
//       } catch(error) {
//             console.error("Error fetching homepage feeds: ", error);
//             showToast(error, 'error');
//       } finally {
//             is_loading = false;
//             // loader_element.style.display = 'none';
//       }

//       return hasMoreContent;
// }


// function RenderNewSections(sections) {
//       const homepageFeedsContent = document.getElementById('homepage-feeds-content');
//       sections.forEach(section => {
//             console.log('section: ', section);
//             switch(section.type) {
//                   case 'videos':
//                         RenderVideosSection(section, homepageFeedsContent);
//                         break;
//                   case 'films': 
//                         RenderFilmThumbnailsSection(section, homepageFeedsContent);
//                         break;
//                   case 'anime_videos':
//                         RenderAnimeVideosSection(section, homepageFeedsContent);
//                         break;
//             }
            
//       });
// }
// async function RenderVideosSection(section, homepageFeedsContent) {
//       const section_container = doms_component.createDiv('section-content_container');
//       const section_title = doms_component.createH3(section.title, 'section-header');
//       const videos_wrapper = doms_component.createDiv('section-videos_wrapper');
//       videos_wrapper.id = 'videos-pagination_section';
     
//       // Tạo 1 mảng các promise
//       const article_promises = section.data.map(video => 
//             videos_component.CreateVideoArticle(video)
//       );
//       // Chờ cho TẤT CẢ các promise hoàn thành
//       const video_articles = await Promise.all(article_promises);     
//       videos_wrapper.append(...video_articles);
//       section_container.appendChild(section_title);
//       section_container.appendChild(videos_wrapper);
//       homepageFeedsContent.appendChild(section_container);  
// }
// async function RenderFilmThumbnailsSection(section, homepageFeedsContent) {
//       const section_container = doms_component.createDiv('section-content_container');
//       const section_title = doms_component.createH3(section.title, 'section-header');
//       const films_wrapper = doms_component.createDiv('list-films_section-wrapper');
      
//       const frame_promises = section.data.map(film => film_component.CreateFilmThumbnailFrame(film));
//       const thumbnail_frames = await Promise.all(frame_promises);
//       films_wrapper.append(...thumbnail_frames);
//       section_container.appendChild(section_title);
//       section_container.appendChild(films_wrapper);
//       homepageFeedsContent.appendChild(section_container);
// }
// async function RenderAnimeVideosSection(section, homepageFeedsContent) {
//       const section_container = doms_component.createDiv('section-content_container');
//       const section_title = doms_component.createH3(section.title, 'section-header');
//       const animeVideos_wrapper = doms_component.createDiv('anime-films_section-wrapper');
//       animeVideos_wrapper.id =  'videos-pagination_section';

//       const aritlce_promises = section.data.map(animeVideo =>
//             videos_component.CreateAnimeVideoArticle(animeVideo)
//       );
//       const animeVideos_article = await Promise.all(aritlce_promises);
//       animeVideos_wrapper.append(...animeVideos_article);
//       section_container.appendChild(section_title);
//       section_container.appendChild(animeVideos_wrapper);
//       homepageFeedsContent.appendChild(section_container);
// }
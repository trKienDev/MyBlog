import { api_user } from "../../api/endpoint.api.js";
import doms_component from "../../components/doms.component.js";
import film_component from "../../components/films.component.js";
import images_component from "../../components/image.component.js";
import videos_component from "../../components/videos.component.js";
import app_configs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import activeState_utils from "../../utils/active-state.js";
import { showToast } from "../../utils/toast-notification.js";

let sectionPages = {
      videos: 1, 
      films: 1, 
      creators: 1, 
      anime_videos: 1,
      anime_films: 1,
      mangas: 1, 
      manga_thumbnails: 1, 
      idols: 1,   
      images: 1, 
      shorts: 1, 
      records: 1,
      clips: 1,
}
let is_loading = false;

// Danh sách các loại section muốn xoay vòng trên trang chủ
const homepageSectionTypes = [ 
      'creators', 'videos', 'films', 
      'anime_videos', 'anime_films', 'mangas',
      'idols', 'images', 'shorts', 'clips',
];

export function HomePageController() {
      const seed = CreateSeed();
      // phần tử loader ở cuối trang, khi nó xuất hiện, ta sẽ tải thêm
      const loader_element = document.getElementById('homepage-feeds-loader');
      if(!loader_element) {
            console.error('#homepage-feeds-loader not found');
            showToast('#homepage-feeds-loader not found', 'error');
            return;
      }

      LoadContentUntilScrollable(loader_element, seed);
      // Bắt đầu theo dõi phần tử loader
      // --- Thiết lập IntersectionObserver ---
      const observer = new IntersectionObserver((entries) => {
            // Nếu loaderElement xuất hiện trong màn hình
            if (entries[0].isIntersecting) {
                  // alert('isInteresting');
                  FetchHomepageBatch(entries[0].target, seed);
            }
      }, {
            root: null, 
            threshold: 0.1
      });
      observer.observe(loader_element)    ;

      activeState_utils.InitializeActiveState('sidebar-item', (activatedSidebar) => {
            HandleActiveSidebar(activatedSidebar);
      });
}
async function HandleActiveSidebar(selected_sidebar) {
      
}

async function LoadContentUntilScrollable(loader_element, sessionSeed) {
      // Gọi fetch lần đầu tiên
      await FetchHomepageBatch(loader_element, sessionSeed);

      // Sau lần fetch đầu tiên, kiểm tra xem có cần fetch tiếp không
      // Vòng lặp sẽ tiếp tục chừng nào nội dung còn ngắn VÀ chúng ta không đang trong một tiến trình tải khác
      if(document.body.scrollHeight <= window.innerHeight) console.log('scrol < height');
      while (document.body.scrollHeight <= window.innerHeight && !is_loading) {     
            // Gọi fetch tiếp và chờ nó xong
            const hasMore = await FetchHomepageBatch(loader_element, sessionSeed);
      }
      if(document.body.scrollHeight > window.innerHeight) console.log('scrol > height');
}

const FetchHomepageBatch = async (loader_element, sessionSeed) => {
      // nếu đang tải rồi thì ko làm gì cả
      if(is_loading) return;

      // --- Xử lý trường hợp đã hết sạch dữ liệu ---
      // Kiểm tra ngay từ đầu, nếu không còn gì để thử thì dừng lại
      if (homepageSectionTypes.length === 0) {
            loader_element.innerHTML = "Bạn đã xem hết nội dung! 🎉";
            loader_element.style.display = 'block';
            // Tại đây bạn có thể ngắt kết nối observer để không gọi lại hàm này nữa
            // observer.disconnect(); // (cần truyền observer vào hàm này)
            return false;
      }
      
      is_loading = true;
      loader_element.style.display = 'block' // hiện icon loading (tùy chọn)
      let hasMoreContent = false;
      let sectionToRender = null;

      while(!hasMoreContent && homepageSectionTypes.length > 0) {
            const typeToFetch = homepageSectionTypes[0];
            const nextPage = sectionPages[typeToFetch] || 1;    // 2. Lấy số trang tiếp theo 
            console.log('type to fetch: ', typeToFetch);
            const apiUrl = `${app_configs.SERVER}${api_user.fetchSectionData}?type=${typeToFetch}&page=${nextPage}&seed=${sessionSeed}`;

            try {
                  const response = await fetch(apiUrl);
                  if(!response.ok) {
                        const error = await response.json();
                        showToast(error.error, 'error');
                        throw new Error('Error HTTP: ', error.error);
                  }
                  const newContent = await response.json();
                  // Kiểm tra kết quả trả về
                  if(newContent.data && newContent.data.length > 0) {
                        // Chỉ lưu dữ liệu vào biến, chưa render vội
                        sectionToRender = {
                              type: typeToFetch,
                              title: typeToFetch,
                              data: newContent.data
                        };
                        sectionPages[typeToFetch]++;                        
                        hasMoreContent = true // đã tải được nội dung
                        const usedType = homepageSectionTypes.shift(); // Lấy ra khỏi đầu mảng
                        homepageSectionTypes.push(usedType); // Đưa vào cuối mảng
                  }  else {
                        homepageSectionTypes.shift(); 
                  }
            } catch(error) {
                  console.error("Error fetching homepage feeds: ", error);
                  showToast(error, 'error');
            } 
      }
      if (sectionToRender) {
            // Bây giờ mới thực hiện render và CHỜ cho nó xong
            await RenderNewSections([sectionToRender]); 
      }
            
      is_loading = false;
      return hasMoreContent;
}


async function RenderNewSections(sections) {
      const homepageFeedsContent = document.getElementById('homepage-feeds-content');
      for(const section of sections) {
            switch(section.type) {
                  case 'videos':
                        await RenderVideosSection(section, homepageFeedsContent);
                        break;
                  case 'films': 
                        RenderFilmThumbnailsSection(section, homepageFeedsContent);
                        break;
                  case 'anime_videos':
                        await RenderAnimeVideosSetion(section, homepageFeedsContent);
                        break;
                  case 'anime_films':
                        await RenderAnimeFilmsSection(section, homepageFeedsContent);
                        break;
                  case 'mangas': 
                        await renderMangaThumbnailsSection(section, homepageFeedsContent);
                        break;
                  case 'images':
                        await renderImageFrameSection(section, homepageFeedsContent);
                        break;
                  case 'shorts': 
                        await renderShortsSection(section, homepageFeedsContent);
                        break;
                  case 'creators':
                        await renderCreatorsAvatarSection(section, homepageFeedsContent);
                        break;
                  case 'idols': 
                        await renderIdolsAvatarSection(section, homepageFeedsContent);
                        break;
                  case 'clips':
                        await renderRecordClipsSection(section, homepageFeedsContent);
                        break;
            }
      }
}
async function RenderVideosSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const videos_wrapper = doms_component.createDiv('section-videos_wrapper');
      videos_wrapper.id = 'videos-pagination_section';
     
      // Tạo 1 mảng các promise
      const article_promises = section.data.map(video => 
            videos_component.CreateVideoArticle(video)
      );
      // Chờ cho TẤT CẢ các promise hoàn thành
      const video_articles = await Promise.all(article_promises);     
      videos_wrapper.append(...video_articles);
      section_container.appendChild(videos_wrapper);
      homepageFeedsContent.appendChild(section_container);  
}
async function RenderFilmThumbnailsSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const films_wrapper = doms_component.createDiv('list-films_section-wrapper');
      
      const frame_promises = section.data.map(film => film_component.CreateFilmThumbnailFrame(film, ServerFolders.FILMS));
      const thumbnail_frames = await Promise.all(frame_promises);
      films_wrapper.append(...thumbnail_frames);
      section_container.appendChild(films_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
async function RenderAnimeVideosSetion(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const animeVideos_wrapper = doms_component.createDiv('list-anime_videos-section_wrapper');

      const article_promises = section.data.map(animeVideo => videos_component.CreateAnimeVideoArticle(animeVideo));
      const animeVideos_article = await Promise.all(article_promises);
      animeVideos_wrapper.append(...animeVideos_article);
      section_container.appendChild(animeVideos_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
async function RenderAnimeFilmsSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const films_wrapper = doms_component.createDiv('list-films_section-wrapper');
      
      const frame_promises = section.data.map(film => film_component.CreateFilmThumbnailFrame(film, ServerFolders.ANIME_FILMS));
      const thumbnail_frames = await Promise.all(frame_promises);
      films_wrapper.append(...thumbnail_frames);
      section_container.appendChild(films_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
async function renderMangaThumbnailsSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const mangas_wrapper = doms_component.createDiv('list-mangas_section-wrapper');
      
      const frame_promises = section.data.map(manga => images_component.createMangaThumbnail(manga));
      const thumbnail_frames = await Promise.all(frame_promises);
      mangas_wrapper.append(...thumbnail_frames);
      section_container.appendChild(mangas_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
async function renderImageFrameSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const images_wrapper = doms_component.createDiv('list-images_section-wrapper');

      const frame_promises = section.data.map(image => images_component.createImageFrame(image));
      const images_frames = await Promise.all(frame_promises);
      images_wrapper.append(...images_frames);
      section_container.appendChild(images_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
async function renderShortsSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const shorts_wrapper = doms_component.createDiv('list-shorts_section-wrapper');
      
      const frame_promises = section.data.map(short => videos_component.CreateVideoPlayer('', short.file_path, ServerFolders.SHORTS, 'short-frame'));
      const short_frames = await Promise.all(frame_promises);
      shorts_wrapper.append(...short_frames);
      section_container.appendChild(shorts_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
async function renderCreatorsAvatarSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const creators_wrapper = doms_component.createDiv('list-creators_section-wrapper');
      
      const avatar_promises = section.data.map(creator => images_component.createCreatorAvatar(creator._id));
      const creator_avatars = await Promise.all(avatar_promises);
      creators_wrapper.append(...creator_avatars);
      section_container.appendChild(creators_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
async function renderIdolsAvatarSection(section, homepageFeedsContent) {
      console.log('section: ', section);
      const section_container = doms_component.createDiv('section-content_container');
      const idols_wrapper = doms_component.createDiv('list-idols_section-wrapper');
      
      const avatar_promises = section.data.map(idol => images_component.createIdolAvatar(idol._id));
      const idol_avatars = await Promise.all(avatar_promises);
      idols_wrapper.append(...idol_avatars);
      section_container.appendChild(idols_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
async function renderRecordClipsSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const clips_wrapper = doms_component.createDiv('list-clips-section_wrapper');

      const article_promises = section.data.map(clip => videos_component.CreateClipArticle(clip));
      const clips_article = await Promise.all(article_promises);
      clips_wrapper.append(...clips_article);
      section_container.appendChild(clips_wrapper);
      homepageFeedsContent.appendChild(section_container);
}
function CreateSeed() {
      return Math.random().toString(36).substring(2);
}

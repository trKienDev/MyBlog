import api_configs from "../../api/api.config.js";
import creator_api from "../../api/creator.api.js";
import { film_api } from "../../api/film.api.js";
import tag_api from "../../api/tag.api.js";
import { video_api } from "../../api/video.api.js";
import div_component from "../../components/div.component.js";
import span_component from "../../components/span.component.js";
import table_component from "../../components/table.component.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import spa_navigation from "../../services/spa/navigate-link.spa.js";
import { error_sweetAlert } from "../../utils/sweet-alert.js";
import { initCreateVideo } from "./create-video.js";
import { redirectToEditVideoPage } from "./edit-video.js";

export async function initVideoAdmin() {
      spa_navigation.navigateLink(id_selectors.buttons.create_video_btn, id_selectors.section.dynamic_section, api_configs.endpoints.adminCreateVideoPage, initCreateVideo);
      renderListVideo();
}     

// async function renderListVideo() {      
//       try {
//             const tbody = document.querySelector(`#${id_selectors.table.video_tbody}`);
//             tbody.innerHTML = '';
            
//             const videos = await video_api.getVideos();
//             console.log('videos: ', videos);
//             videos.forEach(async (video) => {
//                   const tr = table_component.createTrWithId(video._id, 'video-tr');
                  
//                   const edit_btn = await table_component.createEditBtn(
//                         css_selectors.container.edit_container, 
//                         video, 
//                         redirectToEditVideoPage
//                   );
//                   tr.appendChild(edit_btn);

//                   const video_td = await table_component.createVideoTdFromApi({ 
//                         ifile_path: video.file_path, 
//                         iupload_path: 'videos',
//                         icss: css_selectors.videos.video_td 
//                   });
//                   tr.appendChild(video_td);

//                   const film_name = await film_api.getFilmNameById(video.film_id);
//                   const filmName_td = table_component.createTextTd({ i_text: film_name});
//                   tr.appendChild(filmName_td);

//                   const creatorAvatar_td = await table_component.createImgTdFromApi({ 
//                         apiFn: creator_api.getCreatorImg,
//                         id: video.creator_id,
//                         upload_path: ServerFolders.CREATOR_AVATARS,
//                         css_class: css_selectors.creators.creator_image 
//                   });
//                   tr.appendChild(creatorAvatar_td);

//                   const video_views = table_component.createTextTd({ i_text: video.views, i_css: css_selectors.videos.video_views });
//                   tr.appendChild(video_views);

//                   tbody.appendChild(tr);
//             })            
//       } catch(error) {
//             console.error('Error in renderListVideo: ', error);
//             error_sweetAlert('Error loading videos: ', error.message);
//       }
// }


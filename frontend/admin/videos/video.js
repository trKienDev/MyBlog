import api_configs from "../../api/api.config.js";
import creator_api from "../../api/creator.api.js";
import { film_api } from "../../api/film.api.js";
import tag_api from "../../api/tag.api.js";
import { video_api } from "../../api/video.api.js";
import div_component from "../../components/div.component.js";
import span_component from "../../components/span.component.js";
import table_component from "../../components/table.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import spa_navigation from "../../services/spa/navigate-link.spa.js";
import { error_sweetAlert } from "../../utils/sweet-alert.js";
import tags_utils from "../../utils/tags.utils.js";
import { initCreateVideo } from "./create-video.js";
import { redirectToEditVideoPage } from "./edit-video.js";

export async function initVideoAdmin() {
      spa_navigation.navigateLink(id_selectors.buttons.create_video_btn, id_selectors.section.dynamic_section, api_configs.endpoints.adminCreateVideoPage, initCreateVideo);
      renderListVideo();
}     

async function renderListVideo() {      
      try {
            const tbody = document.querySelector(`#${id_selectors.table.video_tbody}`);
            tbody.innerHTML = '';
            
            const videos = await video_api.getVideos();
            console.log('videos: ', videos);
            videos.forEach(async (video) => {
                  const tr = table_component.createTrWithId(video._id);
                  
                  const edit_btn = await table_component.createEditBtn(css_selectors.container.edit_container, 
                                                                                                            video, 
                                                                                                            redirectToEditVideoPage);
                  tr.appendChild(edit_btn);

                  const video_td = await table_component.createVideoTdFromApi({ ifile_path: video.file_path, 
                                                                                                                              iupload_path: 'videos',
                                                                                                                              icss: css_selectors.videos.video_td });
                  const video_name = span_component.createSpanText(video.name, css_selectors.videos.video_name);
                  const videoTags_container = div_component.createDiv({ icss_class: css_selectors.videos.video_tags, idiv_id: id_selectors.videos.video_tags});
                  await tags_utils.renderSelectedTags(video.tag_ids, videoTags_container, tag_api.getTagById);
                  const video_info = div_component.createVideoInfoDiv(video_name, css_selectors.videos.video_info, videoTags_container);
                  video_td.appendChild(video_info);
                  tr.appendChild(video_td);

                  const filmThumbnail_td = await table_component.createImgTdFromApi({ apiFn: film_api.getFilmThumbnail,
                                                                                                                                          id: video.film_id,
                                                                                                                                          upload_path: 'uploads/film',
                                                                                                                                          css_class: css_selectors.films.film_thumbnail});
                  tr.appendChild(filmThumbnail_td);

                  const creatorAvatar_td = await table_component.createImgTdFromApi({ apiFn: creator_api.getCreatorImg,
                                                                                                                                          id: video.creator_id,
                                                                                                                                          upload_path: 'uploads/creator/avatar',
                                                                                                                                          css_class: css_selectors.creators.creator_image });
                  tr.appendChild(creatorAvatar_td);

                  const video_views = table_component.createTextTd({ i_text: video.views, i_css: css_selectors.videos.video_views });
                  tr.appendChild(video_views);

                  tbody.appendChild(tr);
            })            
      } catch(error) {
            console.error('Error in renderListVideo: ', error);
            error_sweetAlert('Error loading videos: ', error.message);
      }
}


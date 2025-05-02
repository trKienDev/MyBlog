import api_configs from "../../api/api.config.js";
import creator_api from "../../api/creator.api.js";
import { film_api } from "../../api/film.api.js";
import { studio_api } from "../../api/studio.api.js";
import tag_api from "../../api/tag.api.js";
import { video_api } from "../../api/video.api.js";
import div_component from "../../components/div.component.js";
import span_component from "../../components/span.component.js";
import table_component from "../../components/table.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { spaNavigateLink } from "../../services/loadElement/load-dynamic-section.js";
import { error_sweetAlert } from "../../utils/sweet-alert.js";
import { initCreateVideo } from "./create-video.js";
import { redirectToEditVideoPage } from "./edit-video.js";

export async function initVideoAdmin() {
      spaNavigateLink(id_selectors.buttons.create_video_btn, api_configs.endpoints.adminCreateVideoPage, initCreateVideo);
      renderListVideo();
}     

async function renderListVideo() {      
      try {
            const tbody = document.querySelector(`#${id_selectors.table.video_tbody}`);
            tbody.innerHTML = '';
            
            const videos = await video_api.getVideos();
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

                  const videoTags_div = div_component.createDiv({ icss_class: css_selectors.videos.video_tags, idiv_id: id_selectors.videos.video_tags});
                  video.tag_ids.forEach(async (tag_id) => {
                        const tag_name = await tag_api.getTagNameById(tag_id);
                        const tag_div = div_component.createDiv({ icss_class: css_selectors.tags.selected_tag, idiv_name: tag_name});
                        videoTags_div.appendChild(tag_div);
                  });
                  
                  const video_info = document.createElement('div');
                  video_info.classList.add('video-info');
                  video_info.appendChild(video_name);
                  video_info.appendChild(videoTags_div);

                  video_td.appendChild(video_info);
                  tr.appendChild(video_td);

                  const filmThumbnail_td = await table_component.createImgTdFromApi({ apiFn: film_api.getFilmThumbnail,
                                                                                                                                          id: video.film_id,
                                                                                                                                          upload_path: 'film',
                                                                                                                                          css_class: css_selectors.films.film_thumbnail});
                  tr.appendChild(filmThumbnail_td);

                  const creatorAvatar_td = await table_component.createImgTdFromApi({ apiFn: creator_api.getCreatorImg,
                                                                                                                                          id: video.creator_id,
                                                                                                                                          upload_path: 'creator/avatar',
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


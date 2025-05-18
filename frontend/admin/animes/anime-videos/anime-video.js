import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import div_component from "../../../components/div.component.js";
import span_component from "../../../components/span.component.js";
import table_component from "../../../components/table.component.js";
import css_selectors from "../../../selectors/css.selectors.js";
import id_selectors from "../../../selectors/element-id.selector.js";
import spa_navigation from "../../../services/spa/navigate-link.spa.js";
import { error_sweetAlert } from "../../../utils/sweet-alert.js";
import tags_utils from "../../../utils/tags.utils.js";
import { initCreateAnimeVideo } from "./create-anime-video.js";
import { redirectToEditAnimeVideoPage } from "./edit-anime-video.js";

export function initAnimeVideo() {
      spa_navigation.navigateLink(id_selectors.buttons.create_video_btn, 'anime-section', api_configs.endpoints.adminAnimeCreateVideosPage, initCreateAnimeVideo);
      renderAnimeVideos();
}

async function renderAnimeVideos() {
      try {
            const tbody = document.querySelector(`#${id_selectors.table.anime_videos} tbody`);
            tbody.innerHTML = '';

            const anime_videos = await animes_api.getAnimeVideos();
            anime_videos.forEach(async (video) => {
                  const tr = table_component.createTrWithId(video._id);

                  const edit_btn = await table_component.createEditBtn(
                        css_selectors.container.edit_container, video, redirectToEditAnimeVideoPage
                  );
                  tr.appendChild(edit_btn);

                  const video_td = await table_component.createVideoTdFromApi({
                        ifile_path: video.file_path,
                        iupload_path: 'anime/videos',
                        icss: css_selectors.videos.video_td
                  });
                  const video_name = span_component.createSpanText(video.name, css_selectors.videos.video_name);
                  const videoTags_container = div_component.createDiv({
                        icss_class: css_selectors.videos.video_tags,
                        idiv_id: id_selectors.videos.video_tags
                  });
                  await tags_utils.renderSelectedTags(video.tag_ids, videoTags_container, animes_api.getAnimeTagById);
                  const video_info = div_component.createVideoInfoDiv(video_name, css_selectors.videos.video_info, videoTags_container);
                  video_td.appendChild(video_info);
                  tr.appendChild(video_td);

                  const filmThumbnail_td = await table_component.createImgTdFromApi({
                        apiFn: animes_api.getAnimeFilmThumbnailById,
                        id: video.film_id,
                        upload_path: 'anime/films',
                        css_class: css_selectors.films.film_thumbnail
                  });
                  tr.appendChild(filmThumbnail_td);

                  const video_views = table_component.createTextTd({
                        i_text: video.views, i_css: css_selectors.videos.video_views
                  });
                  tr.appendChild(video_views);

                  tbody.appendChild(tr);
            });
      } catch(error) {
            console.error('Error in render anime videos: ', error);
            error_sweetAlert('Error loading anime videos: ', error);
      }
}
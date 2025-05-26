import api_configs from "../../api/api.config.js";
import creator_api from "../../api/creator.api.js";
import { film_api } from "../../api/film.api.js";
import { video_api } from "../../api/video.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import videos_component from "../../components/videos.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import FolderUploads from "../../selectors/upload-folder-name.js";
import spa_navigation from "../../services/spa/navigate-link.spa.js";

const newVideo_section = document.getElementById(id_selectors.section.new_video);

export async function newVideoSection() {
      const videos = await video_api.getVideos();
      const newVideos_div = newVideo_section.querySelector('.new-videos');
      newVideos_div.innerHTML = '';

      const video_promises = videos.map(async (video) => {
            const video_article = await createVideoArticle(video);
            newVideos_div.appendChild(video_article);
      });

      await Promise.all(video_promises);

      const video_links = newVideos_div.querySelectorAll('a[href^="video/"]');
      video_links.forEach(link => {
            if (link) {
                  link.addEventListener('click', spa_navigation.navigateMediaLink);
            }
      });
      window.addEventListener('popstate', (event) => {
            console.log("Popstate event:", event.state);
            // Dựa vào event.state để tải lại nội dung tương ứng
            if (event.state && event.state.page === 'watch') {
                  // Tải lại trang video với event.state.videoId
                  // Cần một hàm riêng để xử lý việc này
            } else {
                  // Tải lại trang trước đó hoặc trang chủ
            }
    });
}

async function createVideoArticle(video) {
      let video_article = doms_component.createArticle('video-article');
      const videoArticle_container = doms_component.createDiv('video-article-container');
      
      const videoArticle_ahref = doms_component.createAhref({ href: `video/#id=${video._id}`, css_class: 'video-article-link'});
      videoArticle_container.appendChild(videoArticle_ahref);

      const video_container = createVideo(video);
      videoArticle_ahref.appendChild(video_container);

      const videoInfo_div = await createVideoInfo(video);
      videoArticle_ahref.appendChild(videoInfo_div);

      video_article.appendChild(videoArticle_container);
      videoArticle_ahref.addEventListener('mouseenter', () => {
            const video_frame = videoArticle_ahref.querySelector('video'); 
            if (video_frame) {
            video_frame.play().catch(error => {
                  console.warn("Video play failed:", error);
            });
            }
      });

      videoArticle_ahref.addEventListener('mouseleave', () => {
            const video_frame = videoArticle_ahref.querySelector('video');
            if (video_frame) {
                  video_frame.pause();
            }
      });

      return video_article;
}

function createVideo(video) {
      const video_container = doms_component.createDiv('video-container');

      const videoSrc_ahref = doms_component.createAhref({ css_class: 'video-link'});
      videoSrc_ahref.setAttribute('arial-label', `Watch video: ${video.name}`);

      let video_frame = videos_component.createVideo(css_selectors.videos.video_frame);

      const video_src = videos_component.createVideoSource(`${api_configs.server}/${FolderUploads.VIDEOS}/${video.file_path}`);
      
      video_frame.appendChild(video_src);
      video_container.appendChild(video_frame);

      return video_container;
}

async function createVideoInfo(video) {
      const videoInfo_div = doms_component.createDiv('video-info');
      const videoInfo_container = doms_component.createDiv('video-info-container');
      
      let video_creator = await createCreatorAvatar(video);
      videoInfo_container.appendChild(video_creator);

      const video_film = await createInfor({
            ihref: video.film_id,
            itext: await film_api.getFilmNameById(video.film_id),
            icss_class: 'video-film',
            icontainer_css: 'video-film-container',
      })

      const video_creatorName = await createInfor({
            ihref: video.creator_id,
            itext: await creator_api.getCreatorName(video.creator_id),
            icss_class: 'video-creator',
            icontainer_css: 'video-creator-container',
      });

      const video_details = doms_component.createDiv('video-details');

      const video_views = doms_component.createSpan({ text: `${video.views} views`, css_class: 'video-views'});

      video_details.appendChild(video_film);
      video_details.appendChild(video_creatorName);
      video_details.appendChild(video_views);
      videoInfo_container.appendChild(video_details);
      videoInfo_div.appendChild(videoInfo_container);

      return videoInfo_div;
}

async function createCreatorAvatar(video) {
      const video_creator = doms_component.createDiv('video-creator-avatar');

      const videoCreator_container = doms_component.createDiv('video-creator-avatar-container');
      videoCreator_container.classList.add('container-hover-zoom-img');
      const creator_image = await images_component.createImgFromApi({
            api_function: creator_api.getCreatorImg,
            id: video.creator_id,
            upload_path: FolderUploads.CREATOR_AVATAR,
            css_class: css_selectors.creators.creator_image
      });
      creator_image.classList.add('hover-to-zoom-img');
      videoCreator_container.appendChild(creator_image);
      video_creator.appendChild(videoCreator_container);

      return video_creator;
}

async function createInfor({ ihref, itext, icss_class, icontainer_css}) {
      const info = doms_component.createAhref({
            href: ihref,
            text: itext,
            css_class: icss_class,
      });
      const info_container = doms_component.createDiv(icontainer_css);
      info_container.appendChild(info);
      
      return info_container;
}

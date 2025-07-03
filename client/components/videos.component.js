import creator_api from "../api/creator.api.js";
import { film_api } from "../api/film.api.js";
import app_configs from "../config/app.config.js";
import css_class from "../constants/css.constant.js";
import { ServerFolders } from "../constants/folders.constant.js";
import id_selectors from "../selectors/element-id.selector.js";
import doms_component from "./doms.component.js";
import images_component from "./image.component.js";

async function CreateVideoArticle(video) {
      let video_article = doms_component.createArticle('video-article');
      const videoArticle_container = doms_component.createDiv('video-article-container');
      
      let videoArticle_ahref = doms_component.createAhref({ href: `video/#id=${video._id}`, css_class: 'video-article-link'});
      videoArticle_container.appendChild(videoArticle_ahref);

      const video_container = CreateVideoPlayer(video.name, video.file_path, ServerFolders.VIDEOS);
      videoArticle_ahref.appendChild(video_container);

      const videoInfo_div = await CreateVideoInfo(video);
      videoArticle_ahref.appendChild(videoInfo_div);

      video_article.appendChild(videoArticle_container);

      videoArticle_ahref = hoverMouseVideoToPlay(videoArticle_ahref);

      return video_article;
}

async function CreateVideoInfo(video) {
      const videoInfo_div = doms_component.createDiv('video-info');
      const videoInfo_container = doms_component.createDiv('video-info-container');
      
      let video_creator = await images_component.createCreatorAvatar(video.creator_id);
      videoInfo_container.appendChild(video_creator);

      const video_film = await CreateInfor({
            ihref: video.film_id,
            itext: await film_api.getFilmNameById(video.film_id),
            icss_class: 'video-film',
            icontainer_css: 'video-film-container',
      })

      const video_creatorName = await CreateInfor({
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

async function CreateInfor({ ihref, itext, icss_class, icontainer_css}) {
      const info = doms_component.createAhref({
            href: ihref,
            text: itext,
            css_class: icss_class,
      });
      const info_container = doms_component.createDiv(icontainer_css);
      info_container.appendChild(info);
      
      return info_container;
}

function CreateVideoPlayer(video_name, video_filepath, video_folder) {
      const video_container = doms_component.createDiv('video-container');

      const videoSrc_ahref = doms_component.createAhref({ css_class: 'video-link'});
      videoSrc_ahref.setAttribute('arial-label', `Watch video: ${video_name}`);

      let video_frame = createVideoPreview(css_class.VIDEO_FRAME);

      const video_src = createVideoSource(`${app_configs.SERVER}/${video_folder}/${video_filepath}`);
      
      video_frame.appendChild(video_src);
      video_container.appendChild(video_frame);

      return video_container;
}

function createVideoPreview(css_class) {
      const video = document.createElement('video');
      video.classList.add(css_class);
      video.controls = false;
      video.muted = true;
      
      return video;
}
function createVideoSource(file_path) {
      const source = document.createElement('source');
      source.src = file_path;
      source.type = 'video/mp4';

      return source;
}

function populateVideo(ivideo, upload_path) {
      const video_url = `${app_configs.SERVER}/${upload_path}/${ivideo.file_path}`;
      const video_element = document.querySelector('video');
      const source_element = video_element.querySelector('source');
      const thumbnail_image = document.getElementById(id_selectors.videos.thumbnail_video);
      source_element.src = video_url;
      video_element.load();
      video_element.classList.remove('d-none');
      thumbnail_image.style.display = 'none';
}

function updateVideoSourceById({element_id, ivideo, upload_path}) {
      const video_url = `${app_configs.SERVER}/${upload_path}/${ivideo.file_path}`;
      const video_element = document.getElementById(element_id);
      
      const source_element = video_element.querySelector('source');
      source_element.src = video_url;
      video_element.load();

      return video_element;
}

function hoverMouseVideoToPlay(video_ahref) {
      let playTimeout; 
      
      video_ahref.addEventListener('mouseenter', () => {
            const video_element = video_ahref.querySelector('video');
            if(video_element) {
                  playTimeout = setTimeout(() => {
                        video_element.play().catch(error => {
                              if (error.name !== 'AbortError') {
                                    console.warn('Video play failed: ', error);
                              }
                        });
                  }, 300);
            }
      });
      video_ahref.addEventListener('mouseleave', () => {
            clearTimeout(playTimeout);
            const video_element = video_ahref.querySelector('video');
            if(video_element) {
                  video_element.pause();
            }
      });

      return video_ahref;
}

function CreateAnimeVideoArticle(animeVideo) {
      let animeVideo_article = doms_component.createArticle('video-article');
      const animeVideo_articleContainer = doms_component.createDiv('video-article-container');

      let animeVideo_articleHref = doms_component.createAhref({ href: `anime-video/#id=${animeVideo._id}`, css_class: 'anime-video-article-link'});
      animeVideo_articleContainer.appendChild(animeVideo_articleHref);

      const animeVideo_container = CreateVideoPlayer(animeVideo.name, animeVideo.file_path, ServerFolders.ANIME_VIDEOS);
      animeVideo_articleHref.appendChild(animeVideo_container);

      animeVideo_article.appendChild(animeVideo_articleContainer);
      animeVideo_articleHref = hoverMouseVideoToPlay(animeVideo_articleHref);

      return animeVideo_article;
}

const videos_component = {
      CreateVideoArticle,
      CreateVideoPlayer,
      createVideoPreview,
      createVideoSource,
      CreateAnimeVideoArticle,
      populateVideo,
      updateVideoSourceById,
      hoverMouseVideoToPlay,
}
export default videos_component;
import creator_api from "../api/creator.api.js";
import { film_api } from "../api/film.api.js";
import app_configs from "../config/app.config.js";
import { ServerFolders } from "../constants/folders.constant.js";
import id_selectors from "../selectors/element-id.selector.js";
import doms_component from "./doms.component.js";
import images_component from "./image.component.js";

async function CreateVideoArticle(video) {
      let video_article = doms_component.createArticle('video-article');
      const videoArticle_container = doms_component.createDiv('video-article-container');
      
      let videoArticle_ahref = doms_component.createAhref({ href: `video/#id=${video._id}`, css_class: 'video-article-link'});
      videoArticle_container.appendChild(videoArticle_ahref);

      const video_container = CreateVideoPlayer(video.name, video.file_path, ServerFolders.VIDEOS, 'video-frame');
      videoArticle_ahref.appendChild(video_container);

      const videoInfo_div = await CreateVideoInfo(video);
      videoArticle_ahref.appendChild(videoInfo_div);

      video_article.appendChild(videoArticle_container);

      videoArticle_ahref = hoverMouseVideoToPlay(videoArticle_ahref);

      return video_article;
}
function CreateVideoPlayer(video_name, video_filepath, video_folder, css_class) {
      const video_container = doms_component.createDiv('video-container');

      let videoSrc_ahref = doms_component.createAhref({ css_class: 'video-link'});
      videoSrc_ahref.setAttribute('arial-label', `Watch video: ${video_name}`);

      let video_frame = createVideoPreview(css_class);
      const video_src = createVideoSource(`${app_configs.SERVER}/${video_folder}/${video_filepath}`);
      video_frame.appendChild(video_src);
      videoSrc_ahref.appendChild(video_frame);
      video_container.appendChild(videoSrc_ahref);
      videoSrc_ahref = hoverMouseVideoToPlay(videoSrc_ahref);

      return video_container;
}
function createVideoPreview(css_class) {
      const video = document.createElement('video');
      video.classList.add(css_class);
      // video.controls = false;
      // video.muted = true;
      
      return video;
}
function createVideoSource(file_path) {
      const source = document.createElement('source');
      source.src = file_path;
      source.type = 'video/mp4';
      source.muted = true;
      return source;
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
      const videoDom = video_ahref.querySelector('video');
      video_ahref.addEventListener('mouseenter', () => {
            playTimeout = setTimeout(() => {
                  // videoDom.muted = false;
                  videoDom.play().catch(error => {
                        if (error.name !== 'AbortError') {
                              console.warn('Video play failed: ', error);
                        }
                  });
            }, 300);
      });
      video_ahref.addEventListener('mouseleave', () => {
            clearTimeout(playTimeout);
            videoDom.pause();
      });

      return video_ahref;
}

function CreateAnimeVideoArticle(animeVideo) {
      let animeVideo_article = doms_component.createArticle('video-article');
      const animeVideo_articleContainer = doms_component.createDiv('video-article-container');

      let animeVideo_articleHref = doms_component.createAhref({ href: `anime-video/#id=${animeVideo._id}`, css_class: 'anime-video-article-link'});
      animeVideo_articleContainer.appendChild(animeVideo_articleHref);

      const animeVideo_container = CreateVideoPlayer(animeVideo.name, animeVideo.file_path, ServerFolders.ANIME_VIDEOS, 'video-frame');
      animeVideo_articleHref.appendChild(animeVideo_container);

      animeVideo_article.appendChild(animeVideo_articleContainer);
      animeVideo_articleHref = hoverMouseVideoToPlay(animeVideo_articleHref);

      return animeVideo_article;
}
function CreateClipArticle(clip) {
      let clip_article = doms_component.createArticle('clip-article');
      const clip_articleContainer = doms_component.createDiv('clip-article-container');

      let clip_articleHref = doms_component.createAhref({ href: `clip/#id=${clip._id}`, css_class: 'clip-article-link'});
      clip_articleContainer.appendChild(clip_articleHref);

      const clip_container = CreateVideoPlayer(clip.name, clip.file_path, ServerFolders.CLIPS, 'clip-frame');
      clip_articleHref.appendChild(clip_container);

      clip_article.appendChild(clip_articleContainer);
      clip_articleHref = hoverMouseVideoToPlay(clip_articleHref);

      return clip_article;
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
      CreateClipArticle,
}
export default videos_component;
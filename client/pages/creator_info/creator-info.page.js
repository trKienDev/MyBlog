import creator_api from "../../api/creator.api.js";
import { film_api } from "../../api/film.api.js";
import { video_api } from "../../api/video.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import videos_component from "../../components/videos.component.js";
import app_configs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import activeState_utils from "../../utils/active-state.js";
import date_utils from "../../utils/date.utils.js";
import image_utils from "../../utils/image.utils.js";

export async function creatorInforController(creator_id) {
      populateCreatorAvatar(creator_id);
      populateCreatorBio(creator_id);

      activeState_utils.InitializeActiveState('tab-item', (activatedTab) => {
            HandleActiveTab(activatedTab, creator_id);
      });
}

async function HandleActiveTab(tab, creator_id) { 
      switch(tab.id) {
            case 'creator_videos-tab': 
                  await RenderCreatorVideo(creator_id);
                  break;
            case 'creator_films-tab':
                  await RenderCreatorFilms(creator_id);
                  break;
            case 'creator_photos-tab':
                  console.log('photos');
                  break;
      }
}

// populate video section
async function populateCreatorAvatar(creator_id) {
      const creatorAvatar_div = document.getElementById('creator-avatar');
      const creatorAvatar_image = await images_component.createImgFromApi({
            api_function: creator_api.getCreatorImg,
            id: creator_id,
            upload_path: ServerFolders.CREATOR_AVATARS,
            css_class: 'creator-avatar',
      });
      creatorAvatar_div.appendChild(creatorAvatar_image);
}
async function populateCreatorBio(creator_id) {
      const creator_bio = await creator_api.getCreatorById(creator_id);

      const creatorName_div = document.getElementById('creator-name');
      const creatorName_span = doms_component.createSpan({
            text: creator_bio.name,
            css_class: 'creator-name',
      });
      creatorName_div.appendChild(creatorName_span);

      const creator_birth = date_utils.getDateFromStr(new Date(creator_bio.birth));
      const creatorBirth_div = document.getElementById('creator-birth');
      const creatorBirth_span = doms_component.createSpan({
            text: creator_birth,
            css_class: 'creator-birth',
      });
      creatorBirth_div.appendChild(creatorBirth_span);

      const creatorYearsOld_div = document.getElementById('creator_years-old');
      const creator_yearsold = parseInt(creator_birth.split('-')[2], 10);
      const creator_age = date_utils.calculateAgeFromBirth(creator_yearsold);
      const creatorYearsOld_span = doms_component.createSpan({
            text: creator_age,
            css_class: 'creator-years_old',
      });
      creatorYearsOld_div.appendChild(creatorYearsOld_span);

}

// videos tab
async function RenderCreatorVideo(creator_id) {
      const creatorVideos_section = document.getElementById('creator-videos_section'),
      creatorVideosSection_wrapper = creatorVideos_section.querySelector('.creator-videos_section-wrapper');
      creatorVideosSection_wrapper.innerHTML = '';

      const creatorFilms_section = document.getElementById('creator-films_section'),
      creatorFilmSection_wrapper = creatorFilms_section.querySelector('.creator-films_section-wrapper');
      creatorFilmSection_wrapper.innerHTML = '';
      
      const creator_videos = await video_api.getVideosByCreatorId(creator_id);

      creator_videos.forEach(video => {
            const video_article = CreateVideoPlayer(video);
            creatorVideosSection_wrapper.appendChild(video_article);      
      });
}
function CreateVideoPlayer(video) {
      let video_article = doms_component.createArticle('video-article');
      const videoArticle_container = doms_component.createDiv('video-article-container');
            
      let videoArticle_ahref = doms_component.createAhref({ href: `video/#id=${video._id}`, css_class: 'video-article-link'});
      videoArticle_container.appendChild(videoArticle_ahref);

      const video_container = videos_component.CreateVideoPlayer(video.name, video.file_path, ServerFolders.VIDEOS);
      videoArticle_ahref.appendChild(video_container);

      const videoInfor_div = doms_component.createDiv('video-infor_container');
      const videoName_span = doms_component.createSpan({
            text: video.name,
            css_class: 'video-name',
      });
      const videoViews_span = doms_component.createSpan({
            text: `${video.views} views`,
            css_class: 'video-views',
      })
      videoInfor_div.appendChild(videoName_span);
      videoInfor_div.appendChild(videoViews_span);
      videoArticle_ahref.appendChild(videoInfor_div);

      video_article.appendChild(videoArticle_container);
      videoArticle_ahref = videos_component.hoverMouseVideoToPlay(videoArticle_ahref);

      return video_article;
}

// films tab
async function RenderCreatorFilms(creator_id) {
      const creatorVideos_section = document.getElementById('creator-videos_section'),
      creatorVideosSection_wrapper = creatorVideos_section.querySelector('.creator-videos_section-wrapper');
      creatorVideosSection_wrapper.innerHTML = '';

      const creatorFilms_section = document.getElementById('creator-films_section'),
      creatorFilmSection_wrapper = creatorFilms_section.querySelector('.creator-films_section-wrapper');
      creatorFilmSection_wrapper.innerHTML = '';      
      
      const creator_films = await film_api.GetFilmsByCreatorId(creator_id);
      creator_films.forEach(film => {
            const film_article = CreateFilmThumbnailFrame(film);
            creatorFilmSection_wrapper.appendChild(film_article);
      });
}
function CreateFilmThumbnailFrame(film) {
      const film_article = doms_component.createArticle('film-article');
      const filmArticle_container = doms_component.createDiv('film-article_container');
      film_article.appendChild(filmArticle_container);

      const filmArticle_ahref = doms_component.createAhref({
            href: `film/#id=${film._id}`,
            css_class: 'film-article_link',
      });
      filmArticle_container.appendChild(filmArticle_ahref);

      const filmThumbnail_container = doms_component.createDiv('film-thumbnail_container');
      const filmThumbnail_image = images_component.createImg(null, 'film-thumbnail_image');
      filmThumbnail_image.src = `${app_configs.SERVER}/${ServerFolders.FILMS}/${film.thumbnail}`;
      filmThumbnail_container.appendChild(filmThumbnail_image);
      filmArticle_ahref.appendChild(filmThumbnail_container);
      image_utils.addEffectHoverToZoomImage(filmThumbnail_container, filmThumbnail_image);

      const filmInfor_div = doms_component.createDiv('film-infor_container');
      
      const filmName_div = doms_component.createDiv('film-name');
      filmName_div.textContent = film.name;
      filmInfor_div.appendChild(filmName_div);

      const filmDate_str = date_utils.getDateFromStr(new Date(film.date));
      const filmDate_div = doms_component.createDiv('film-date');
      filmDate_div.textContent = filmDate_str;
      filmInfor_div.appendChild(filmDate_div);

      filmArticle_ahref.appendChild(filmInfor_div);
      return film_article;
}

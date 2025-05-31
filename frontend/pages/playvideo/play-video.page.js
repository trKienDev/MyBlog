import { film_api } from "../../api/film.api.js";
import playlist_api from "../../api/playlist.api.js";
import { studio_api } from "../../api/studio.api.js";
import { video_api } from "../../api/video.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import span_component from "../../components/span.component.js";
import stars_component from "../../components/stars.component.js";
import tags_component from "../../components/tags.component.js";
import thumbnail_component from "../../components/thumbnail.component.js";
import videos_component from "../../components/videos.component.js";
import dom_id from "../../constants/doms.constant.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import date_utils from "../../utils/date.utils.js";

export async function playVideoPageController(id) {
      const video = await video_api.getVideoById(id);
      console.log('video: ', video);
      
      renderVideoData(video);
      renderFilmData(video.film_id);
      renderFilmVideo(video); 
}

async function renderVideoData(video) {
      videos_component.updateVideoSourceById({element_id: dom_id.VIDEO_PLAYER, ivideo: video, upload_path: ServerFolders.VIDEOS });
      populateVideoActionData(video);
      populateVideoFilm(video);
      span_component.updateSpanText(dom_id.VIDEO_TOTAL_VIEWS, video.views);
      span_component.updateSpanText(dom_id.VIDEO_TOTAL_LIKES, video.likes);
      populateCreatorAvatar(video);
      populateVideoTags(video);
      populateVideoPlaylist(video);
}
async function populateVideoFilm(video) {
      const video_film = await film_api.getFilmNameById(video.film_id);
      span_component.updateSpanText(dom_id.VIDEO_FILM_NAME, video_film);
}
async function populateVideoActionData(video) {
      const video_action = document.getElementById(dom_id.VIDEO_ACTION);
      const action_tag = await tags_component.createTagDivFromAPI({ tag_id: video.action_id, tag_css: 'tag-item' });
      video_action.appendChild(action_tag);

      return video_action;
}
async function populateCreatorAvatar(video) {
      const video_creator = document.getElementById('video-creator');
      const creator_avatar = await images_component.createCreatorAvatar(video.creator_id);
      video_creator.appendChild(creator_avatar);

      return video_creator;
}
async function populateVideoTags(video) {
      const video_tags = document.getElementById(dom_id.VIDEO_TAGS);
      video.tag_ids.forEach(async (tag) => {
            const video_tag = await tags_component.createTagDivFromAPI({ tag_id: tag, tag_css: 'tag-item' });
            video_tags.appendChild(video_tag);
      })

      return video_tags;
}
async function populateVideoPlaylist(video) {
      const videoPlaylist_element = document.getElementById('video-playlist');
      const videoPlaylist_name = await playlist_api.getPlaylistName(video.playlist_id);
      const playlist_ahref = doms_component.createAhref({
            href: `#playlist=${video.playlist_id}`,
            text: videoPlaylist_name,
            css_class: 'playlist-link',
      })
      videoPlaylist_element.appendChild(playlist_ahref);
}

async function renderFilmData(film_id) {
      thumbnail_component.updateFilmThumbnailSource({ film_id: film_id, thumbnailElement_id: dom_id.VIDEO_FILM_THUMBNAIL, upload_path: `${ServerFolders.FILMS}`});
      const film_info = await film_api.findFilmById(film_id);
      console.log('film info: ', film_info);
      
      populateFilmName(film_info);
      populateFilmStudio(film_info);
      populateFilmDate(film_info);
      populateFilmCollection(film_info);
      stars_component.createStarsRating('film-rating', film_info.rating);

      const film_tags = document.getElementById('film-tags');
      populateFilmTags(film_info);

}     
function populateFilmName(film_info) {
      const filmName_ahref = doms_component.createAhref({
            href: `film/#${film_info._id}`,
            text: film_info.name,
            css_class: 'film-name',
      });

      const filmName_element = document.getElementById('film-name');
      filmName_element.appendChild(filmName_ahref);
}
async function populateFilmStudio(film_info) {
      const filmStudio_element = document.getElementById('film-studio');
      const filmStudio_name = await studio_api.getStudioNameById(film_info.studio_id);
      const filmStudio_aref = doms_component.createAhref({
            href: `studio/#${film_info.studio_id}`,
            text: filmStudio_name,
            css_class: 'film-studio',
      });
      filmStudio_element.appendChild(filmStudio_aref);
}
async function populateFilmDate(film_info) {
      const filmDate_element = document.getElementById('film-date');
      const filmDate_str = date_utils.getDateFromStr(new Date(film_info.date));
      const filmDate_span = doms_component.createSpan({
            text: filmDate_str,
      });
      filmDate_element.appendChild(filmDate_span);
}
function populateFilmCollection(film_info) {
      if(typeof film_info.collection_id === 'undefined') {
            const filmCollection_element = document.getElementById('film-collection');
            const filmCollection_span = doms_component.createSpan({
                  text: 'no collection',
            })
            filmCollection_element.appendChild(filmCollection_span);
      }
}
async function populateFilmTags(film_info) {
      const filmTags_element = document.getElementById('film-tags');
      film_info.tag_ids.forEach(async (tag) => {
            const film_tag = await tags_component.createTagDivFromAPI({ tag_id: tag, tag_css: 'tag-item' });
            filmTags_element.appendChild(film_tag);
      });

      return filmTags_element;
}

// related videos
async function renderFilmVideo(video_info) {
      const filmVideos = document.getElementById('film-videos');
      const id_filmVideos = await getRelatedVideosByFilm(video_info);
      id_filmVideos.forEach(async (video_id) => {
            const video_filepath = await video_api.getVideoFilePath(video_id);
            
            const video_frame = doms_component.createDiv('film-videos_frame');
            const video_container = doms_component.createDiv('film-videos_container');
            let video_ahref = doms_component.createAhref({ href: `video/#id=${video_id}`, css_class: ''});

            const video_name = await video_api.getVideoName(video_id);
            const video_player = videos_component.createVideoPlayer(video_name, video_filepath);
            video_ahref.appendChild(video_player);
            video_container.appendChild(video_ahref);
            video_frame.appendChild(video_container);

            video_ahref = videos_component.hoverMouseVideoToPlay(video_ahref);

            filmVideos.appendChild(video_frame);
      });
}

async function getRelatedVideosByFilm(video_info) {
      const film = await film_api.findFilmById(video_info.film_id);
      const film_videos = film.video_ids.filter(id => id !== video_info._id);

      return film_videos;
}
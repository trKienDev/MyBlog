import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import tag_api from "../../../api/tag.api.js";
import selectSearch_component from "../../../components/select-search.component.js";
import videos_component from "../../../components/videos.component.js";
import css_selectors from "../../../selectors/css.selectors.js";
import id_selectors from "../../../selectors/element-id.selector.js";
import spa_renderHTML from "../../../services/spa/render-html.js";
import image_utils from "../../../utils/image.utils.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";
import tags_utils from "../../../utils/tags.utils.js";
import { showToast } from "../../../utils/toast-notification.js";
import video_utils from "../../../utils/video.utils.js";

export function redirectToEditAnimeVideoPage(ivideo) {
      spa_renderHTML.loadContentFromUrl(api_configs.endpoints.adminAnimeEditVIdeoPage, id_selectors.section.anime_section, () => initEditAnimeVideoAdmin(ivideo));
}

async function initEditAnimeVideoAdmin(ivideo) {
      selectSearch_component.initSelectSearch(id_selectors.anime.anime_film, api_configs.endpoints.getAnimeFilms, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.anime_action, api_configs.endpoints.getAnimeTagsByAction, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.anime_tag, api_configs.endpoints.getAnimeVideoTags, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.anime_playlist, api_configs.endpoints.getAnimePlaylists, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.anime.anime_tag);
      video_utils.waitForUploadVideo(id_selectors.videos.thumbnail_video, id_selectors.videos.upload_video);
      image_utils.displayThumbnailOfSelectedSearchFilm(id_selectors.anime.anime_film, 'uploads/anime/films', animes_api.getAnimeFilmById);
      populateAnimeVideoInfo(ivideo);
      video_utils.waitForUploadNewVideo();
      updateAnimeVideo(ivideo);
}


async function populateAnimeVideoInfo(ivideo) {
      const anime_film = await animes_api.getAnimeFilmById(ivideo.film_id);
      image_utils.loadThumbnailOfSelectedFilm(anime_film, 'uploads/anime/films');

      await selectSearch_component.loadInfoSelectSearch(ivideo, id_selectors.anime.anime_film, 'film_id', animes_api.getAnimeFilmNameById);
      await selectSearch_component.loadInfoSelectSearch(ivideo, id_selectors.anime.anime_action, 'action_id', animes_api.getAnimeTagNameById);
      await selectSearch_component.loadInfoSelectSearch(ivideo, id_selectors.anime.anime_playlist, 'playlist_id', animes_api.getAnimePlaylistNameById);

      const selectTag_container = document.getElementById(id_selectors.container.selected_tag);
      await tags_utils.renderSelectedTags(ivideo.tag_ids, selectTag_container, animes_api.getAnimeTagById);

      videos_component.populateVideo(ivideo, 'uploads/anime/videos');
}

function updateAnimeVideo(ivideo) {
      const submitVideo_btn = document.getElementById(id_selectors.videos.submit_video_btn);
      submitVideo_btn.addEventListener('click', async() => {
            const video_info = collectVideoInfo();
            const updated_fields = getUpdatedAnimeVideoFields(ivideo, video_info);
            const updatedVideo_form = buildUpdateAnimeVideoForm(updated_fields);
            console.log('updated video form: ', updatedVideo_form);
            try {
                  const result = await fetch_api.updateForm(`${api_configs.endpoints.updateAnimeVideo}/${ivideo._id}`, updatedVideo_form);
                  if(result.success === false) {
                        showToast('Error updating anime video', 'error');
                        console.error('Error updating anime video');
                        throw new Error(result.error);
                  }

                  const updated_video = result.data;
                  success_sweetAlert('video updated');
            } catch(error) {
                  console.error('Error updating video: ', error);
                  error_sweetAlert(error);
            }
      });
}

function collectVideoInfo() {
     const film_id = selectSearch_component.getSelectedOptionValue(id_selectors.anime.anime_film, 'id');
      const film_name = selectSearch_component.getSelectedOptionValue(id_selectors.anime.anime_film, 'text');

      const action_id = selectSearch_component.getSelectedOptionValue(id_selectors.anime.anime_action, 'id');
      const action_text = selectSearch_component.getSelectedOptionValue(id_selectors.anime.anime_action, 'text');

      const video_name = film_name + '_' + action_text;

      const playlist_id = selectSearch_component.getSelectedOptionValue(id_selectors.anime.anime_playlist, 'id');
      const tag_ids = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

      if(tag_ids.length === 0) {
            showToast('Please select at least a tag', 'warning');
            return;
      }

      const upload_input = document.getElementById(id_selectors.videos.upload_video);
      const file = upload_input.files[0];

      return { video_name, film_id, action_id, playlist_id, tag_ids, file};
}

function getUpdatedAnimeVideoFields(ivideo, video_info) {
      const changes = {};

      changes.video_name = video_info.video_name;

      const id_fields = ['action_id', 'film_id', 'playlist_id'];
      id_fields.forEach(function(field) {
            if(video_info[field] != null && video_info[field] !== ivideo[field]) {
                  changes[field] = video_info[field];
            }
      });

      if(Array.isArray(video_info.tag_ids)) {
            const new_tags = video_info.tag_ids;
            const old_tags = Array.isArray(ivideo.tag_ids) ? ivideo.tag_ids : [];
            let is_different = false;

            if(new_tags.length !== old_tags.length) {
                  is_different = true; 
            } else {
                  for(let i = 0; i < new_tags.length; i++) {
                        if(new_tags[i] !== old_tags[i]) {
                              is_different = true;
                              break;
                        }
                  }
            }

            if(is_different) {
                  changes.tag_ids = new_tags;
            }
      }

      if(video_info.file instanceof File) {
            changes.file = video_info.file;
      }

      return changes;
}

function buildUpdateAnimeVideoForm(updated_fields) {
      const video_form = new FormData();
      video_form.append("name", updated_fields.video_name);
      if(updated_fields.film_id) {
            video_form.append("film_id", updated_fields.film_id);
      }
      if(updated_fields.action_id) {
            video_form.append("action_id", updated_fields.action_id);
      }
      if(updated_fields.playlist_id) {
            video_form.append("playlist_id", updated_fields.playlist_id);
      }
      if(updated_fields.tag_ids) {
            video_form.append("tag_ids", updated_fields.tag_ids);
      }
      if(updated_fields.file) {
            video_form.append("file", updated_fields.file);
      }
      return video_form;
}
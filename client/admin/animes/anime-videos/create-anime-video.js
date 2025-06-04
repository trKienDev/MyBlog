import animes_api from "../../../api/anime.api.js";
import api_configs from "../../../api/api.config.js";
import fetch_api from "../../../api/fetch.api.js";
import selectSearch_component from "../../../components/select-search.component.js";
import css_selectors from "../../../selectors/css.selectors.js";
import id_selectors from "../../../selectors/element-id.selector.js";
import image_utils from "../../../utils/image.utils.js";
import { error_sweetAlert, success_sweetAlert } from "../../../utils/sweet-alert.js";
import tags_utils from "../../../utils/tags.utils.js";
import video_utils from "../../../utils/video.utils.js";

export async function initCreateAnimeVideo() {
      selectSearch_component.initSelectSearch(id_selectors.anime.anime_film, api_configs.endpoints.getAnimeFilms, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.anime_action, api_configs.endpoints.getAnimeTagsByAction, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.anime_tag, api_configs.endpoints.getAnimeVideoTags, 'name');
      selectSearch_component.initSelectSearch(id_selectors.anime.anime_playlist, api_configs.endpoints.getAnimePlaylists, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.anime.anime_tag);
      video_utils.waitForUploadVideo(id_selectors.videos.thumbnail_video, id_selectors.videos.upload_video);
      image_utils.displayThumbnailOfSelectedSearchFilm(id_selectors.anime.anime_film, 'uploads/anime/films', animes_api.getAnimeFilmById);
      createAnimeVideo();
}

function createAnimeVideo() {
      const submitVideo_btn = document.getElementById(id_selectors.videos.submit_video_btn);
      submitVideo_btn.addEventListener('click', async() => {
            const video_info = collectAnimeVideoInfo();
            const video_form = buildVideoForm(video_info);
            console.log('video form: ', video_form);
            try {
                  const result = await fetch_api.createForm(api_configs.endpoints.createAnimeVideo, video_form);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert("Video created successfully");
                  resetCreateAnimeVideoForm();
            } catch(error) {
                  console.error('Error creating anime video: ', error);
                  error_sweetAlert(error);
            }
      });
}

function collectAnimeVideoInfo() {
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
      if(!file) {
            showToast('Please upload your video', 'warning');
            return;
      }

      return { video_name, film_id, action_id, playlist_id, tag_ids, file};
}

function buildVideoForm(video_info) {
      const video_form = new FormData();
      video_form.append("name", video_info.video_name);
      video_form.append("action_id", video_info.action_id);
      video_form.append("film_id", video_info.film_id);
      video_form.append("playlist_id", video_info.playlist_id);
      video_form.append("tag_ids", video_info.tag_ids);
      video_form.append("file", video_info.file);

      return video_form;
}

function resetCreateAnimeVideoForm() {
      video_utils.resetVideoPreview();
      tags_utils.resetTagSelection(id_selectors.container.selected_tag);
      selectSearch_component.resetSelectSearch([
            { id: id_selectors.anime.anime_action, placeholder: "Select Action" },
            { id: id_selectors.anime.anime_playlist, placeholder: "Select Playlist" },
      ]);
}
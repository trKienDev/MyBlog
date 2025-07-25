import api_configs from "../../api/api.config.js";
import selectSearch_component from "../../components/select-search.component.js";
import id_selectors from "../../selectors/element-id.selector.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { showToast } from "../../utils/toast-notification.js";
import { getCodeByStudio } from "../films/films.js";
import css_selectors from "../../selectors/css.selectors.js";
import fetch_api from "../../api/fetch.api.js";
import tags_utils from "../../utils/tags.utils.js";
import video_helpers from "./video.helper.js";
import video_utils from "../../utils/video.utils.js";
import file_utils from "../../utils/file.utils.js";
import dom_id from "../../constants/doms.constant.js";

export function initCreateVideo() {
      initSearchFilm();
      const search_btn = video_helpers.createSearchFilmBtn(id_selectors.films.search_film);
      selectSearch_component.initSelectSearch(dom_id.VIDEO_ACTION, api_configs.endpoints.getTagsByAction, 'name');
      selectSearch_component.initSelectSearch(id_selectors.videos.video_creator, api_configs.endpoints.getCreators, 'name');
      selectSearch_component.initSelectSearch(id_selectors.videos.video_tag, api_configs.endpoints.getTagsByVideo, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.videos.video_tag);
      video_utils.waitForUploadVideo(id_selectors.videos.thumbnail_video, id_selectors.videos.upload_video);
      createVideo();
}

// Core function
function createVideo() {
      const submitVideo_btn = document.getElementById(id_selectors.videos.submit_video_btn);
      submitVideo_btn.addEventListener('click', async () => {
            const video_info = collectVideoInfo();
            const video_form = buildVideoForm(video_info);

            try { 
                  const result = await fetch_api.createForm(api_configs.endpoints.createVideo, video_form);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  showToast('video create successfully', 'success');
                  resetCreateVideoForm();
            } catch(error) {
                  console.error('Error creating video: ', error);
                  showToast(error, 'error');
            }
      });
}

// Search film
async function initSearchFilm() {
      try {
            selectSearch_component.initSelectSearch(id_selectors.films.film_studio, api_configs.endpoints.getStudios, 'name');
            getCodeByStudio(id_selectors.films.film_studio);
      } catch(error) {
            console.error('Error initSearchFilm: ', error);
            error_sweetAlert(error);
      }
}

// create video
function collectVideoInfo() {
      const tag_ids = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);
      if(tag_ids.length === 0) {
            showToast('Please select at least a tag', 'warning');
            return;
      }

      const upload_input = document.getElementById(id_selectors.videos.upload_video);
      const video = upload_input.files[0];
      if(!video) {
            showToast('Please upload your video', 'warning');
            return;
      }
      
      const action_id = selectSearch_component.getSelectedOptionValue(id_selectors.videos.video_action, 'id');
      const action_text = selectSearch_component.getSelectedOptionValue(id_selectors.videos.video_action, 'text');

      const film_table = document.getElementById(id_selectors.table.search_film),
      selected_film = film_table.querySelector('tr.selected');
      const film_id = selected_film.getAttribute('film-id');
      const film_info = selected_film.querySelectorAll('td');
      const film_name = film_info[0].textContent.trim();
      
      const studio_td = film_info[1];
      const studio_id = studio_td.querySelector('span').getAttribute('data-id');
      const code_id = selected_film.getAttribute('code-id');

      const video_name = film_name + '_' + action_text;
      const renamed_video = file_utils.renameUploadedFile(video, video_name);
      const playlist_id = selectSearch_component.getSelectedOptionValue(id_selectors.videos.video_playlist, 'id');
      const creator_id = selectSearch_component.getSelectedOptionValue(id_selectors.videos.video_creator, 'id');

      return { video_name, film_id, code_id, studio_id, action_id, playlist_id, creator_id, tag_ids, file: renamed_video };
}

function buildVideoForm(video_info) {
      const video_form = new FormData();
      video_form.append("name", video_info.video_name);
      video_form.append("film_id", video_info.film_id);
      video_form.append("code_id", video_info.code_id);
      video_form.append("studio_id", video_info.studio_id);
      video_form.append("action_id", video_info.action_id);
      video_form.append("playlist_id", video_info.playlist_id);
      video_form.append("creator_id", video_info.creator_id);
      video_form.append("tag_ids", video_info.tag_ids);
      video_form.append("file", video_info.file);
      
      return video_form;
}

function resetCreateVideoForm() {
      const thumbnail_image = document.getElementById(id_selectors.videos.thumbnail_video);
      const upload_input = document.getElementById(id_selectors.videos.upload_video);
      video_utils.ResetVideoPreview(thumbnail_image, upload_input);

      selectSearch_component.resetSelectSearch([
            { id: id_selectors.videos.video_action, placeholder: "Select Action" },
      ]);
}

import { api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import playlist_api from "../../api/playlist.api.js";
import modal_component from "../../components/modal.component.js";
import multiSelectSearch_component from "../../components/multi-select-search.component.js";
import selectSearch_component from "../../components/select-search.component.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import { showToast } from "../../utils/toast-notification.js";

export async function videoPlaylistModalController(video) {
      modal_component.initModal('open-videoplaylist_modal', 'close-videoplaylist_modal', 'video-playlist_modal');
      selectSearch_component.initSelectSearch('add_video-playlist', api_user.getPlaylists, 'name');
      multiSelectSearch_component.displaySelectedOptions({
            selectSearchContainer_id: 'selected-options_container',
            selectedOption_class: 'selected-option',
            selectElement_id: 'add_video-playlist',
      });
      renderSelectedPlaylist(video);

      const addVideoPlaylist_btn = document.getElementById('add-videoplaylist-btn');
      addVideoPlaylist_btn.addEventListener('click', async () => {
            event.preventDefault();
            const playlist_ids = multiSelectSearch_component.getSelectedOptions('selected-options_container', 'selected-option');
            if(playlist_ids.length === 0) {
                  showToast('Please select at least a playlist', 'warning');
                  return;
            }
            
            const data = { playlist_ids: playlist_ids};

            try {
                  const result = await fetch_api.updateJson(`${api_user.addPlaylistsToVideo}/${video._id}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert('playlist added');
            } catch(error) {
                  console.error('Error adding playlist to video: ', error.message);
                  error_sweetAlert(error.message);
            }
      });
}

async function renderSelectedPlaylist(video) {
      const selectPlaylist_container = document.getElementById('selected-options_container');
      selectPlaylist_container.innerHTML = '';
      await multiSelectSearch_component.renderSelectedOptions(video.playlist_ids, selectPlaylist_container, playlist_api.getPlaylistById);
}
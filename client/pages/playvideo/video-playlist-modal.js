import { api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import playlist_api from "../../api/playlist.api.js";
import { video_api } from "../../api/video.api.js";
import modal_component from "../../components/modal.component.js";
import multiSelectSearch_component from "../../components/multi-select-search.component.js";
import selectSearch_component from "../../components/select-search.component.js";
import { showToast } from "../../utils/toast-notification.js";
import { populateVideoPlaylist } from "./play-video.page.js";

const selected_playlist_container = 'selected-playlists_container';

export async function videoPlaylistModalController(video) {
      modal_component.initModal('open-videoplaylist_modal', 'close-videoplaylist_modal', 'video-playlist_modal');
      selectSearch_component.initSelectSearch('add_video-playlist', api_user.getPlaylists, 'name');
      multiSelectSearch_component.displaySelectedOptions({
            selectSearchContainer_id: selected_playlist_container,
            selectedOption_class: 'selected-option',
            selectElement_id: 'add_video-playlist',
      });
      renderSelectedPlaylist(video);

      const addVideoPlaylist_btn = document.getElementById('add-videoplaylist-btn');
      addVideoPlaylist_btn.addEventListener('click', async (event) => {
            await addPlaylistsToVideo(event, video);
      });
}

async function renderSelectedPlaylist(video) {
      const selectPlaylist_container = document.getElementById(selected_playlist_container);
      selectPlaylist_container.innerHTML = '';
      await multiSelectSearch_component.renderSelectedOptions(video.playlist_ids, selectPlaylist_container, playlist_api.getPlaylistById);
}

async function addPlaylistsToVideo(event, video) {
      event.preventDefault();
      const playlist_ids = multiSelectSearch_component.getSelectedOptions(selected_playlist_container, 'selected-option');
      if(playlist_ids.length === 0) {
            showToast('Please select at least a playlist', 'warning');
            return;
      }
      
      const data = { playlist_ids: playlist_ids};
      console.log('data: ', data);
      try {
            const result = await fetch_api.updateJson(`/video/${video._id}/playlists`, data);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            showToast('video playlist added', 'success');
            resetPlaylistModal();
            const updated_video = await video_api.getVideoById(video._id);
            populateVideoPlaylist(updated_video);
      } catch(error) {
            console.error('Error adding playlist to video: ', error.message);
            showToast('error add playlist to video', 'error');
      }
}

function resetPlaylistModal() {
      selectSearch_component.resetSelectSearch([
            { id: "add_video-playlist", placeholder: "Select playlist" },
      ]);
      modal_component.closeModal("video-playlist_modal");
}
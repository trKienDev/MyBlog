import { api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import modal_component from "../../components/modal.component.js";
import multiSelectSearch_component from "../../components/multi-select-search.component.js";
import selectSearch_component from "../../components/select-search.component.js";
import { showToast } from "../../utils/toast-notification.js";
import { populateFilmCollection } from "./play-video.page.js";

const selected_collections_container = 'selected-collections_container';

export async function FilmCollectionModalController(film_id) {
      modal_component.initModal('open_film_collection-modal', 'close_film_collection-modal', 'film_collection-modal');
      selectSearch_component.initSelectSearch('add_film-collection', api_user.getCollections, 'name');
      multiSelectSearch_component.displaySelectedOptions({
            selectSearchContainer_id: selected_collections_container,
            selectedOption_class: 'selected-option',
            selectElement_id: 'add_film-collection',
      });

      const addFilmCollection_btn = document.getElementById('add_film_collection-btn');
      addFilmCollection_btn.addEventListener('click', async(event) => {
            await AddCollectionToFilm(event, film_id);
      });
}

      // async function renderSelectedPlaylist(video) {
      //       const selectPlaylist_container = document.getElementById(selected_collection_container);
      //       selectPlaylist_container.innerHTML = '';
      //       await multiSelectSearch_component.renderSelectedOptions(video.playlist_ids, selectPlaylist_container, playlist_api.getPlaylistById);
      // }

async function AddCollectionToFilm(event, film_id) {
      event.preventDefault();
      const collection_ids = multiSelectSearch_component.getSelectedOptions(selected_collections_container, 'selected-option');
      if(collection_ids.length === 0) {
            showToast('Please select at least a collection', 'warning');
            return;
      }

      const data = { collection_ids: collection_ids};
      try {
            const result = await fetch_api.updateJson(`/admin/film/${film_id}/collections`, data);
            if(result.success === false) {
                  throw new Error(result.error);
            }

            showToast('film collection added', 'success');
            ResetCollectionModal();
            populateFilmCollection(result.data);
      } catch(error) {
            console.error('Error updating collections to film: ', error.message);
            showToast('error adding collections to film', 'error');
      }
}

function ResetCollectionModal() {
      selectSearch_component.resetSelectSearch([
            { id: "add_film-collection", placeholder: "Select collection" },
      ]);
      modal_component.closeModal("film_collection-modal");
}
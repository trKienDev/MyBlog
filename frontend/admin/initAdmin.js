import api_configs from "../api/api.config.js";
import loadDynamicSection_service from "../services/load-section/load-dynamic-section.js";
import { handleElementActiveState } from "../utils/active-state.js";
import { initCodeAdmin } from "./codes/code.js";
import { InitCollectionAdmin } from "./collections/collection.js";
import { initCreatorAdmin } from "./creators/creator.js";
import { initFilmAdmin } from "./films/films.js";
import { initPlaylistAdmin } from "./playlists/playlist.js";
import { initStudioAdmin } from "./studios/studio.js";
import { initTagAdmin } from "./tags/tag.js";
import { initVideoAdmin } from "./videos/video.js";

let dynamicLoadingElement = 'dynamic-section';

function initAdmin() {
      handleElementActiveState(".sidebar-item");
      navigateSidebar();
}

document.addEventListener('DOMContentLoaded', initAdmin);

function navigateSidebar() {
      spaNavigateLink('creator-link', api_configs.endpoints.adminCreatorPage, initCreatorAdmin );
      spaNavigateLink('studio-link', api_configs.endpoints.adminStudioPage, initStudioAdmin );
      spaNavigateLink('film-link', api_configs.endpoints.adminFilmPage, initFilmAdmin );
      spaNavigateLink('code-link', api_configs.endpoints.adminCodePage, initCodeAdmin );
      spaNavigateLink('tag-link', api_configs.endpoints.adminTagPage, initTagAdmin );
      spaNavigateLink('collection-link', api_configs.endpoints.adminCollectionPage, InitCollectionAdmin );
      spaNavigateLink('video-link', api_configs.endpoints.adminVideoPage, initVideoAdmin );
      spaNavigateLink('playlist-link', api_configs.endpoints.adminPlaylistPage, initPlaylistAdmin );
}

function spaNavigateLink(link_id, endpoint, callback = () => {}) {
      const link_element = document.getElementById(link_id);
      if (link_element) {
                  if (!link_element.hasAttribute('data-navigate-initialized')) {
                  link_element.addEventListener('click', event => {
                        event.preventDefault();
                        loadDynamicSection_service.loadContentFromUrl(endpoint, dynamicLoadingElement, callback);
                  });
                  link_element.setAttribute('data-navigate-initialized', 'true'); // Đánh dấu đã gán
            }
      } else {
            console.error(`Element with id: "${link_id}" not found`);
      }
}

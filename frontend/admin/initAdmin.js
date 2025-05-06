import api_configs from "../api/api.config.js";
import spa_navigation from "../services/spa/navigate-link.spa.js";
import { handleElementActiveState } from "../utils/active-state.js";
import { initAdminAnime } from "./animes/anime.js";
import { initCodeAdmin } from "./codes/code.js";
import { InitCollectionAdmin } from "./collections/collection.js";
import { initCreatorAdmin } from "./creators/creator.js";
import { initFilmAdmin } from "./films/films.js";
import { initPlaylistAdmin } from "./playlists/playlist.js";
import { initStudioAdmin } from "./studios/studio.js";
import { initTagAdmin } from "./tags/tag.js";
import { initVideoAdmin } from "./videos/video.js";

let dynamic_section = 'dynamic-section';

function initAdmin() {
      handleElementActiveState(".sidebar-item");
      navigateSidebar();
}

document.addEventListener('DOMContentLoaded', initAdmin);

function navigateSidebar() {
      spa_navigation.navigateLink('creator-link', dynamic_section, api_configs.endpoints.adminCreatorPage, initCreatorAdmin );
      spa_navigation.navigateLink('studio-link', dynamic_section, api_configs.endpoints.adminStudioPage, initStudioAdmin );
      spa_navigation.navigateLink('film-link', dynamic_section, api_configs.endpoints.adminFilmPage, initFilmAdmin );
      spa_navigation.navigateLink('code-link', dynamic_section, api_configs.endpoints.adminCodePage, initCodeAdmin );
      spa_navigation.navigateLink('tag-link', dynamic_section, api_configs.endpoints.adminTagPage, initTagAdmin );
      spa_navigation.navigateLink('collection-link', dynamic_section, api_configs.endpoints.adminCollectionPage, InitCollectionAdmin );
      spa_navigation.navigateLink('video-link', dynamic_section, api_configs.endpoints.adminVideoPage, initVideoAdmin );
      spa_navigation.navigateLink('playlist-link', dynamic_section, api_configs.endpoints.adminPlaylistPage, initPlaylistAdmin );
      spa_navigation.navigateLink('admin-anime', dynamic_section, api_configs.endpoints.adminAnimePage, initAdminAnime );
}



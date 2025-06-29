import api_configs from "../api/api.config.js";
import ClientPages from "../constants/client-pages.constant.js";
import id_selectors from "../selectors/element-id.selector.js";
import spa_navigation from "../services/spa/navigate-link.spa.js";
import activeState_utils from "../utils/active-state.js";
import { initAdminAnime } from "./animes/anime.js";
import { initCodeAdmin } from "./codes/code.js";
import { InitCollectionAdmin } from "./collections/collection.js";
import { initCreatorAdmin } from "./creators/creator.js";
import { initFilmAdmin } from "./films/films.js";
import { AdminIdolsController } from "./idols/idol.admin.js";
import { AdminImageController } from "./images/image.admin.js";
import { AdminMangaController } from "./mangas/manga.admin.js";
import { initPlaylistAdmin } from "./playlists/playlist.js";
import { AdminRecordController } from "./records/record.admin.js";
import { AdminShortController } from "./shorts/short.admin.js";
import { AdminStudioController } from "./studios/studio.js";
import { initTagAdmin } from "./tags/tag.js";
import { initVideoAdmin } from "./videos/video.js";

function initAdmin() {
      activeState_utils.handleElementActiveState(".sidebar-item");
      navigateSidebar();
}

document.addEventListener('DOMContentLoaded', initAdmin);

function navigateSidebar() {
      spa_navigation.navigateLink('creator-link', id_selectors.section.dynamic_section, api_configs.endpoints.adminCreatorPage, initCreatorAdmin );
      spa_navigation.navigateLink('studio-link', id_selectors.section.dynamic_section, api_configs.endpoints.adminStudioPage, AdminStudioController );
      spa_navigation.navigateLink('film-link', id_selectors.section.dynamic_section, api_configs.endpoints.adminFilmPage, initFilmAdmin );
      spa_navigation.navigateLink('code-link', id_selectors.section.dynamic_section, api_configs.endpoints.adminCodePage, initCodeAdmin );
      spa_navigation.navigateLink('tag-link', id_selectors.section.dynamic_section, api_configs.endpoints.adminTagPage, initTagAdmin );
      spa_navigation.navigateLink('collection-link', id_selectors.section.dynamic_section, api_configs.endpoints.adminCollectionPage, InitCollectionAdmin );
      spa_navigation.navigateLink('video-link', id_selectors.section.dynamic_section, api_configs.endpoints.adminVideoPage, initVideoAdmin );
      spa_navigation.navigateLink('playlist-link', id_selectors.section.dynamic_section, api_configs.endpoints.adminPlaylistPage, initPlaylistAdmin );
      spa_navigation.navigateLink('admin-anime', id_selectors.section.dynamic_section, api_configs.endpoints.adminAnimePage, initAdminAnime );
      spa_navigation.navigateLink('admin-manga', id_selectors.section.dynamic_section, ClientPages.ADMIN_MANGA, AdminMangaController );
      spa_navigation.navigateLink('admin-idol', id_selectors.section.dynamic_section, ClientPages.ADMIN_IDOL, AdminIdolsController );
      spa_navigation.navigateLink('admin-image', id_selectors.section.dynamic_section, ClientPages.ADMIN_IMAGE, AdminImageController );
      spa_navigation.navigateLink('admin-short', id_selectors.section.dynamic_section, ClientPages.ADMIN_SHORT, AdminShortController );
      spa_navigation.navigateLink('admin-record', id_selectors.section.dynamic_section, ClientPages.ADMIN_RECORD, AdminRecordController );
}



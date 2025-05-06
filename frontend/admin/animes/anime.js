import api_configs from "../../api/api.config.js";
import spa_navigation from "../../services/spa/navigate-link.spa.js";
import { initAnimeStudio } from "./anime-studios/anime-studio.js";

export function initAdminAnime() {
      navigateAnimeMenu();
}

function navigateAnimeMenu() {
      spa_navigation.navigateAnchorLink('admin-studios', 'anime-section', api_configs.endpoints.adminAnimeStudiosPage, initAnimeStudio);
}
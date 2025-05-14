import api_configs from "../../api/api.config.js";
import spa_navigation from "../../services/spa/navigate-link.spa.js";
import { initAnimeFilm } from "./anime-films/anime-film.js";
import { initAnimeSeries } from "./anime-series/anime-series.js";
import { initAnimeStudio } from "./anime-studios/anime-studio.js";
import { initAnimeTag } from "./anime-tags/anime-tag.js";
import { initAnimeVideo } from "./anime-videos/anime-video.js";

export function initAdminAnime() {
      navigateAnimeMenu();
}

function navigateAnimeMenu() {
      spa_navigation.navigateAnchorLink('anime-studios', 'anime-section', api_configs.endpoints.adminAnimeStudiosPage, initAnimeStudio);
      spa_navigation.navigateAnchorLink('anime-series', 'anime-section', api_configs.endpoints.adminAnimeSeriesPage, initAnimeSeries);
      spa_navigation.navigateAnchorLink('anime-tags', 'anime-section', api_configs.endpoints.adminAnimeTagsPage, initAnimeTag);
      spa_navigation.navigateAnchorLink('anime-films', 'anime-section', api_configs.endpoints.adminAnimeFilmsPage, initAnimeFilm ); 
      spa_navigation.navigateAnchorLink('anime-videos', 'anime-section', api_configs.endpoints.adminAnimeVideosPage, initAnimeVideo ); 
      
}
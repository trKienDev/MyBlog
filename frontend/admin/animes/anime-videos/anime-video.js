import api_configs from "../../../api/api.config.js";
import id_selectors from "../../../selectors/element-id.selector.js";
import spa_navigation from "../../../services/spa/navigate-link.spa.js";

export function initAnimeVideo() {
      spa_navigation.navigateLink(id_selectors.buttons.create_video_btn, 'anime-section', api_configs.endpoints.adminAnimeCreateVideosPage);
}
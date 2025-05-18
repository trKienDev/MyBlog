import api_configs from "../../api/api.config.js";
import id_selectors from "../../selectors/element-id.selector.js";
import spa_navigation from "../../services/spa/navigate-link.spa.js";
import { initCreateMangaAdmin } from "./create-manga.js";

export async function initMangaAdmin() {
      spa_navigation.navigateLink(id_selectors.buttons.create_manga_btn, id_selectors.section.dynamic_section, api_configs.endpoints.adminCreateMangaPage, initCreateMangaAdmin );
}


// create manga

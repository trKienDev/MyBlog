import api_configs from "../../api/api.config.js";
import { newVideoSection } from "../../sections/new-videos/new-video.section.js";
import { initTagSection } from "../../sections/tags/tags.section.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import spa_renderHTML from "../../services/spa/render-html.js";
import { handleElementActiveState } from "../../utils/active-state.js";

document.addEventListener("DOMContentLoaded", initHomepage);
let dynamic_pages = 'dynamic-pages';


function initHomepage() {
      handleElementActiveState(`.${css_selectors.sidebar.sidebar_item}`);
      loadHomePageSection();
}

function loadHomePageSection() {
      spa_renderHTML.loadContentFromUrl(api_configs.endpoints.tagsSection, id_selectors.section.tag_section, initTagSection);
      spa_renderHTML.loadContentFromUrl(api_configs.endpoints.newVideosSection, id_selectors.section.new_video, newVideoSection);
}



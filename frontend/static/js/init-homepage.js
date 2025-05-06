import api_configs from "../../api/api.config.js";
import { initTagSection } from "../../sections/tags/tags.section.js";
import spa_renderHTML from "../../services/spa/render-html.js";
import { handleElementActiveState } from "../../utils/active-state.js";

const tag_section = 'tags-section';

document.addEventListener("DOMContentLoaded", initHomepage);

function initHomepage() {
      handleElementActiveState(".sidebar-item");
      loadTagsSection();
}

function loadTagsSection() {
      const endpoint = api_configs.endpoints.tagsSection;
      spa_renderHTML.loadContentFromUrl(endpoint, tag_section, initTagSection);
}


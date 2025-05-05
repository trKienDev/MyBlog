import api_configs from "../../api/api.config.js";
import { initTagSection } from "../../sections/tags/tags.section.js";
import loadDynamicSection_service from "../../services/spa/load-dynamic-section.spa.js";
import { handleElementActiveState } from "../../utils/active-state.js";

const tag_section = 'tags-section';

document.addEventListener("DOMContentLoaded", initHomepage);

function initHomepage() {
      handleElementActiveState(".sidebar-item");
      loadTagsSection();
}

function loadTagsSection() {
      const endpoint = api_configs.endpoints.tagsSection;
      loadDynamicSection_service.loadContentFromUrl(endpoint, tag_section, initTagSection);
}


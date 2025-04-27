import api_configs from "../../api/api.config.js";
import { spaNavigateLink } from "../../services/loadElement/load-dynamic-section.js";
import { initCreateVideo } from "./create-video.js";

let createVideo_btnId = 'create-video';

export async function initVideoAdmin() {
      spaNavigateLink(createVideo_btnId, api_configs.endpoints.adminCreateVideoPage, initCreateVideo);
}



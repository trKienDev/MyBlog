import apiConfig from "../../api/api.config.js";
import { navigate_link } from "../../services/loadElement/load-dynamic-section.js";

let createVideo_btnId = 'create-video';

export async function admin_intiVideo() {
      navigate_link(createVideo_btnId, apiConfig.endpoints.admin_createVideoPage);
}
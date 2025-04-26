import apiConfig from "../../api/api.config.js";
import { navigate_link } from "../../services/loadElement/load-dynamic-section.js";
import { admin_createVideo } from "./create-video.js";

let createVideo_btnId = 'create-video';

export async function admin_intiVideo() {
      navigate_link(createVideo_btnId, apiConfig.endpoints.admin_createVideoPage, admin_createVideo);
}
import { video_api } from "../../api/video.api.js";

export async function playVideoPageController(id) {
      const video = await video_api.getVideoById(id);
      console.log('video: ', video);
}
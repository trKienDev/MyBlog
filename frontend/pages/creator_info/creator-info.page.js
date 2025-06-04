import creator_api from "../../api/creator.api.js";
import { video_api } from "../../api/video.api.js";

export async function creatorInforController(creator_id) {
      const creator = await creator_api.getCreatorById(creator_id);

      const videosByCreator = await video_api.getVideosByCreatorId(creator_id);

      const creatorVideos_section = document.getElementById('creator-videos_section');
      
}

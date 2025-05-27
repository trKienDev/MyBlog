import ClientPages from "../constants/client-pages.constant.js";
import { playVideoPageController } from "../pages/playvideo/play-video.page.js";

export const router_config = {
      'video': (id) => ({
            endpoint: ClientPages.PLAYVIDEO, 
            media_id: id,           
            url: `/watch?video=${id}`,
            state: { page: 'watch', videoId: id },
            title: `Watching ${id}`,
            callback: playVideoPageController,
      }),
}
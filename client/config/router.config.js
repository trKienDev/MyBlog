import ClientPages from "../constants/client-pages.constant.js";
import { creatorInforController } from "../pages/creator_info/creator-info.page.js";
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

      'creator': (id) => ({
            endpoint: ClientPages.CREATORINFO, 
            media_id: id,           
            url: `/info?creator=${id}`,
            state: { page: 'infor', videoId: id },
            title: `Looking ${id}`,
            callback: creatorInforController,
      }),

      'film': (id) => ({
            endpoint: ClientPages.FILMINFO,
            media_id: id,
            url: `/info?film=${id}`,
            state: { page: 'infor', videoId: id },
            title: `Looking ${id}`,
            callback: FilmInforController,
      }),
}
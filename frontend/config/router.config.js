import ClientPages from "../constants/client-pages.constant.js";

export const router_config = {
      'video': (id) => ({
            endpoint: ClientPages.PLAYVIDEO,            
            url: `/watch?video=${id}`,
            state: { page: 'watch', videoId: id },
            title: `Watching ${id}`,
      }),
}
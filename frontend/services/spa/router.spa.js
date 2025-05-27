import { router_config } from "../../config/router.config.js";
import ClientPages from "../../constants/client-pages.constant.js";
import ElementsId from "../../constants/element-id.constant.js";
import { HomePageController } from "../../pages/homepage/homepage.page.js";
import spa_renderHTML from "./render-html.js";

window.addEventListener('popstate', (event) => {
      console.log("Popstate triggered!");
      console.log("Current Location:", window.location.pathname);
      console.log("State:", event.state);

      // Lấy đường dẫn hiện tại
      const search = window.location.search;;
      console.log('search: ', search);

      // Kiểm tra xem nên tải trang nào
      if (search.includes('video=')) {
            const params = new URLSearchParams(search);
            const prefix = params.keys().next().value;
            const media_id = params.get(prefix);
            if (media_id) {
                  spa_renderHTML.loadMediaPages(prefix, media_id, false);
            } else {
                  spa_renderHTML.loadContentFromUrl(ClientPages.HOMEPAGE, ElementsId.PAGECONTENT, HomePageController);
            }
      } else if (path === '/') {
            spa_renderHTML.loadContentFromUrl(ClientPages.HOMEPAGE, ElementsId.PAGECONTENT, HomePageController);
      } else {
            spa_renderHTML.loadContentFromUrl(ClientPages.HOMEPAGE, ElementsId.PAGECONTENT, HomePageController);
      }
});
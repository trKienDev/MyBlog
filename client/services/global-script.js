import ClientPages from "../../constants/client-pages.constant.js";
import { HomePageController } from "../../pages/homepage/homepage.page.js";
import dom_id from "../constants/doms.constant.js";
import spa_navigation from "./spa/navigate-link.spa.js";
import spa_renderHTML from "./spa/render-html.js";

// router
window.addEventListener('popstate', (event) => {
      console.log("Popstate triggered!");
      console.log("Current Location:", window.location.pathname);
      console.log("State:", event.state);

      const search = window.location.search;;

      const params = new URLSearchParams(search);
      const prefix = params.keys().next().value;
      const media_id = params.get(prefix);
      if (media_id) {
            spa_renderHTML.loadMediaPages(prefix, media_id, false);
      } else {
            spa_renderHTML.loadContentFromUrl(ClientPages.HOMEPAGE, dom_id.PAGE_CONTENT, HomePageController);
      }
});

document.addEventListener('DOMContentLoaded', function() {
      const pathname = window.location.pathname;
      const search = window.location.search;
      document.addEventListener('click', function(event) {
            handleUserClick(event);    
      });
        
});

function handleUserClick(event) {
      const video_link = event.target.closest('a[href^="video/"]');
      
      if (video_link) {
            if (typeof spa_navigation !== 'undefined' && spa_navigation.navigateMediaLink) {
                  spa_navigation.navigateMediaLink(event, video_link);
            } else {
                  console.error("spa_navigation.navigateMediaLink is not defined. Make sure spa_navigation.js is loaded before global-scripts.js and spa_navigation is globally accessible.");
            }
      }

      const creator_link = event.target.closest('a[href^="creator/"]');
      if (creator_link) {
            if (typeof spa_navigation !== 'undefined' && spa_navigation.navigateMediaLink) {
                  spa_navigation.navigateMediaLink(event, creator_link);
            } else {
                  console.error("spa_navigation.navigateMediaLink is not defined. Make sure spa_navigation.js is loaded before global-scripts.js and spa_navigation is globally accessible.");
            }
      }
}
import ClientPages from "../../constants/client-pages.constant.js";
import { HomePageController } from "../../pages/homepage/homepage.page.js";
import { film_api } from "../api/film.api.js";
import doms_component from "../components/doms.component.js";
import ClientSections from "../constants/client-sections.constant.js";
import dom_id from "../constants/doms.constant.js";
import { FilmSectionController } from "../sections/films/films.section.js";
import { HomepageAnimeVideosSectionController } from "../sections/homepage-anime-videos/homepage-anime-videos.section.js";
import { HomepageCollectionSectionController } from "../sections/homepage-collections/homepage-collections.section.js";
import { HomePageCreatorsSectionController } from "../sections/homepage-creators/homepage-creators.section.js";
import { HomepageImageSectionController } from "../sections/homepage-images/homepage-image.section.js";
import { HomepageMangasSectionController } from "../sections/homepage-mangas/homepage-mangas.section.js";
import { HomepagePlaylistSectionController } from "../sections/homepage-playlists/homepage-playlist.section.js";
import { HomepageShortsSectionController } from "../sections/homepage-shorts/homepage-short.section.js";
import { HomepageStudiosSectionController } from "../sections/homepage-studios/studio.section.js";
import { HomepageTagsSectionController } from "../sections/homepage-tags/homepage-tags.section.js";
import { HomepageVideosSectionController } from "../sections/homepage-videos/homepage-videos.section.js";
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
      document.addEventListener('click', function(event) {
            handleUserClick(event);    
      });
        
});

async function handleUserClick(event) {   
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
      const studio_link = event.target.closest('a[href^="studio/"]');
      if (studio_link) {
            if (typeof spa_navigation !== 'undefined' && spa_navigation.navigateMediaLink) {
                  spa_navigation.navigateMediaLink(event, studio_link);
            } else {
                  console.error("spa_navigation.navigateMediaLink is not defined. Make sure spa_navigation.js is loaded before global-scripts.js and spa_navigation is globally accessible.");
            }
      }
      const tag_link = event.target.closest('a[href^="tag/"]');
      if(tag_link) {
            if (typeof spa_navigation !== 'undefined' && spa_navigation.navigateMediaLink) {
                  spa_navigation.navigateMediaLink(event, tag_link);
            } else {
                  console.error("spa_navigation.navigateMediaLink is not defined. Make sure spa_navigation.js is loaded before global-scripts.js and spa_navigation is globally accessible.");
            }
      }
      const collection_link = event.target.closest('a[href^="collection/"]');
      if(collection_link) {
            event.preventDefault();
            if (typeof spa_navigation !== 'undefined' && spa_navigation.navigateMediaLink) {
                  spa_navigation.navigateMediaLink(event, collection_link);
            } else {
                  console.error("spa_navigation.navigateMediaLink is not defined. Make sure spa_navigation.js is loaded before global-scripts.js and spa_navigation is globally accessible.");
            }
      }
      const playlist_link = event.target.closest('a[href^="playlist/"]');
      if(playlist_link) {
            event.preventDefault();
            if (typeof spa_navigation !== 'undefined' && spa_navigation.navigateMediaLink) {
                  spa_navigation.navigateMediaLink(event, playlist_link);
            } else {
                  console.error("spa_navigation.navigateMediaLink is not defined. Make sure spa_navigation.js is loaded before global-scripts.js and spa_navigation is globally accessible.");
            }
      }
      const manga_link = event.target.closest('a[href^="manga/"]');
      if(manga_link) {
            event.preventDefault();
            if (typeof spa_navigation !== 'undefined' && spa_navigation.navigateMediaLink) {
                  spa_navigation.navigateMediaLink(event, manga_link);
            } else {
                  console.error("spa_navigation.navigateMediaLink is not defined. Make sure spa_navigation.js is loaded before global-scripts.js and spa_navigation is globally accessible.");
            }
      }
      const film_link = event.target.closest('a[href^="film/"]');
      if(film_link) {
            event.preventDefault();
            try {
                  const filmLink_href = film_link.getAttribute('href');
                  const id_part = filmLink_href.split('#id=');
                  const film_id = id_part[1];
                  const film = await film_api.findFilmById(film_id);
                  const first_videoId = film.video_ids[1];
                  const firstVideo_link = doms_component.createAhref({
                        href: `video/#id=${first_videoId}`
                  });
                  if (typeof spa_navigation !== 'undefined' && spa_navigation.navigateMediaLink) {
                        spa_navigation.navigateMediaLink(event, firstVideo_link);
                  } else {
                        console.error("spa_navigation.navigateMediaLink is not defined. Make sure spa_navigation.js is loaded before global-scripts.js and spa_navigation is globally accessible.");
                  }
            } catch(error) {
                  alert(error);
            }
      }

      const section_homepage = event.target.closest('a[href^="#"]');
      if(section_homepage) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientPages.HOMEPAGE, 'page-content', HomePageController);
      }
      const section_videos = event.target.closest('a[href^="sections/videos"]');
      if(section_videos) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_VIDEOS, 'main-content', HomepageVideosSectionController);
      }
      const section_film = event.target.closest('a[href^="sections/films"]');
      if(section_film) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.FILMS, 'main-content', FilmSectionController);
      }
      const section_studios = event.target.closest('a[href^="sections/studios"]');
      if(section_studios) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.STUDIOS, 'main-content', HomepageStudiosSectionController );
      }
      const section_tags = event.target.closest('a[href^="sections/tags"]');
      if(section_tags) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_TAGS , 'main-content', HomepageTagsSectionController);
      }
      const section_creators = event.target.closest('a[href^="sections/creators"]');
      if(section_creators) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_CREATORS , 'main-content', HomePageCreatorsSectionController);
      }
      const homepage_collection_section = event.target.closest('a[href^="sections/homepage_collections"]');
      if(homepage_collection_section) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_COLLECTIONS, 'main-content', HomepageCollectionSectionController);
      }
      const homepage_playlist_section = event.target.closest('a[href^="sections/homepage_playlists"]');
      if(homepage_playlist_section) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_PLAYLISTS, 'main-content', HomepagePlaylistSectionController);
      }
      const images_section = event.target.closest('a[href^="sections/homepage-images"]');
      if(images_section) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_IMAGES, 'main-content', HomepageImageSectionController);
      }
      const shorts_section = event.target.closest('a[href^="sections/homepage-shorts"]');
      if(shorts_section) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_SHORTS, 'main-content', HomepageShortsSectionController);
      }
      const anime_section = event.target.closest('a[href^="sections/homepage-animes"]');
      if(anime_section) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_ANIMES, 'main-content', HomepageAnimeVideosSectionController);
      }
      const mangas_section = event.target.closest('a[href^="sections/homepage-mangas"]');
      if(mangas_section) {
            event.preventDefault();
            spa_renderHTML.loadContentFromUrl(ClientSections.HOMEPAGE_MANGAS, 'main-content',HomepageMangasSectionController);
      }
}
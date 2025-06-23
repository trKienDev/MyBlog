import { ClientFolders } from "./folders.constant.js";

const ClientSections = {
      TAGS: `/${ClientFolders.SECTIONS}/tags/tags.section.html`,
      NEWVIDEOS: `/${ClientFolders.SECTIONS}/pagined-videos/pagined-videos.section.html`,
      FILMS: `/${ClientFolders.SECTIONS}/films/films.section.html`,
      STUDIOS: `/${ClientFolders.SECTIONS}/homepage-studios/homepage-studio.section.html`,          
      HOMEPAGE_TAGS: `/${ClientFolders.SECTIONS}/homepage-tags/homepage-tags.section.html`, 
      HOMEPAGE_CREATORS: `/${ClientFolders.SECTIONS}/homepage-creators/homepage-creators.section.html`, 
      HOMEPAGE_COLLECTIONS:  `/${ClientFolders.SECTIONS}/homepage-collections/homepage-collections.section.html`, 
      HOMEPAGE_PLAYLISTS:  `/${ClientFolders.SECTIONS}/homepage-playlists/homepage-playlist.section.html`, 
}
export default ClientSections;
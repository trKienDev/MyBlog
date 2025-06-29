import animeFilm_controller from "../controllers/animes/anime-film.controller.js";
import animePlaylist_controller from "../controllers/animes/anime-playlist.controller.js";
import animeSeries_controller from "../controllers/animes/anime-series.controller.js";
import animeStudio_controller from "../controllers/animes/anime-studio.controller.js";
import animeTag_controller from "../controllers/animes/anime-tag.controller.js";
import animeVideo_controller from "../controllers/animes/anime-video.controller.js";
import code_controller, { createCode, getCode_byId } from "../controllers/code.controller.js";
import collection_controller from "../controllers/collection.controller.js";
import { CreateCreator, creator_controller, DeleteCreator, UpdateCreator } from "../controllers/creator.controller.js";
import { filmController } from "../controllers/film.controller.js";
import gallery_controller from "../controllers/gallery.controller.js";
import idol_controller from "../controllers/idol.controller.js";
import image_controller from "../controllers/image.controller.js";
import mangaTag_controller from "../controllers/mangas/manga-tag.controller.js";
import { manga_controller } from "../controllers/mangas/manga.controller.js";
import playlist_controller from "../controllers/playlist.controller.js";
import record_controller from "../controllers/record.controller.js";
import short_controller from "../controllers/short.controller.js";
import studio_controller, { DeleteStudio, UpdateStudio } from "../controllers/studio.controller.js";
import { createTag, tag_controller } from "../controllers/tag.controller.js";
import video_controller from "../controllers/video.controller.js";
import { Route } from "../interfaces/Route.js";
import { validated_id } from "../middlewares/validate-id.js";
import { createRouter } from "./routes.js";

const adminRoutes: Route[] = [
      // studio 
      { method: 'GET', path: '/admin/studios', handler: studio_controller.GetStudios },
      { method: 'GET', path: '/admin/studio/:id', handler: validated_id.validateId(studio_controller.getStudioById) },
      { method: 'POST', path: '/admin/studio', handler: studio_controller.CreateStudio },
      { method: 'PUT', path: '/admin/studio/:id', handler: validated_id.validateId(UpdateStudio) },
      { method: 'DELETE', path: '/admin/studio/:id', handler: validated_id.validateId(DeleteStudio) },
      // creator
      { method: 'GET', path: '/admin/creators', handler: creator_controller.GetCreators },
      { method: 'GET', path: '/admin/creator/:id', handler: validated_id.validateId(creator_controller.getCreatorById) },
      { method: 'POST', path: '/admin/creator', handler: CreateCreator },
      { method: 'PUT', path: '/admin/creator/:id', handler: validated_id.validateId(UpdateCreator) },
      { method: 'DELETE', path: '/admin/creator/:id', handler: validated_id.validateId(DeleteCreator) },
      // tag
      { method: 'GET', path: '/admin/tags', handler: tag_controller.GetTags },
      { method: 'GET', path: '/admin/tag/:id', handler: validated_id.validateId(tag_controller.getTagById) },
      { method: 'GET', path: '/admin/tags/film', handler: tag_controller.GetTagsByFilm },
      { method: 'GET', path: '/admin/tags/video', handler: tag_controller.getTagsByVideo },
      { method: 'GET', path: '/admin/tags/action', handler: tag_controller.getTagsByAction },
      { method: 'POST', path: '/admin/tag', handler: createTag},
      // code
      { method: 'GET', path: '/admin/codes', handler: code_controller.GetCodes },
      { method: 'GET', path: '/admin/code/:id', handler: validated_id.validateId(getCode_byId) },
      { method: 'GET', path: '/admin/codes/studio/:id', handler: validated_id.validateId(code_controller.GetCodesByStudio) },
      { method: 'POST', path: '/admin/code', handler: createCode },
      // collection
      { method: 'GET', path: '/admin/collections', handler: collection_controller.getCollections },
      { method: 'GET', path: '/admin/collection/:id', handler: validated_id.validateId(collection_controller.getCollectionById) },
      { method: 'POST', path: '/admin/collection', handler: collection_controller.createCollection },
      // film
      { method: 'GET', path: '/admin/films', handler: filmController.getFilms },
      { method: 'GET', path: '/admin/film/:id', handler: validated_id.validateId(filmController.findFilmById) },
      { method: 'GET', path: '/admin/films/studio-code/:studio_id/:code_id', handler: validated_id.validateIds(['studio_id', 'code_id'], filmController.findFilmsByStudioAndCode) },
      { method: 'POST', path: '/admin/film', handler: filmController.createFilm },
      { method: 'PUT', path: '/admin/film/:id', handler: validated_id.validateId(filmController.updateFilm) },
      { method: 'PUT', path: '/admin/film/:id/collections', handler: validated_id.validateId(filmController.UpdateFilmCollections )},
      
      // video
      { method: 'GET', path: '/admin/videos', handler: video_controller.getVideos },
      { method: 'GET', path: '/admin/video/:id', handler: validated_id.validateId(video_controller.findVideoById ) },
      { method: 'POST', path: '/admin/video', handler: video_controller.createVideo },
      { method: 'PUT', path: '/admin/video/:id', handler: validated_id.validateId(video_controller.updatedVideo ) },
      // playlist
      { method: 'GET', path: '/admin/playlists', handler: playlist_controller.getPlaylists },
      { method: 'GET', path: '/admin/playlist/:id', handler: validated_id.validateId(playlist_controller.findTagById )},
      { method: 'POST', path: '/admin/playlist', handler: playlist_controller.createPlaylist },

      // anime-studio
      { method: 'GET', path: '/admin/anime-studio/:id', handler: validated_id.validateId(animeStudio_controller.getAnimeStudioById)},
      { method: 'GET', path: '/admin/anime-studios', handler: animeStudio_controller.getAnimeStudios },
      { method: 'POST', path: '/admin/anime-studio', handler: animeStudio_controller.createAnimeStudio },
      // anime-series
      { method: 'GET', path: '/admin/anime-series/:id', handler: validated_id.validateId(animeSeries_controller.getAnimeSeriesById )},
      { method: 'GET', path: '/admin/anime-series', handler: animeSeries_controller.getAnimeSeries },
      { method: 'POST', path: '/admin/anime-series', handler: animeSeries_controller.createAnimeSeries },
      // anime-tags
      { method: 'GET', path: '/admin/anime-tags', handler: animeTag_controller.getAnimeTags },
      { method: 'GET', path: '/admin/anime-tag/:id', handler: validated_id.validateId(animeTag_controller.getAnimeTagById) },
      { method: 'GET', path: '/admin/anime-tags/film', handler: animeTag_controller.getAnimeTagsByFilm },
      { method: 'GET', path: '/admin/anime-tags/action', handler: animeTag_controller.getAnimeTagByAction },
      { method: 'GET', path: '/admin/anime-tags/video', handler: animeTag_controller.getAnimeVideoTags },
      { method: 'POST', path: '/admin/anime-tag', handler: animeTag_controller.createAnimeTag },
      // anime-films
      { method: 'GET', path: '/admin/anime-films', handler: animeFilm_controller.getAnimeFilms },
      { method: 'GET', path: '/admin/anime-film/:id', handler: validated_id.validateId(animeFilm_controller.findAnimeById) },
      { method: 'POST', path: '/admin/anime-film', handler: animeFilm_controller.createAnimeFilm },
      { method: 'PUT', path: '/admin/anime-film/:id', handler: validated_id.validateId(animeFilm_controller.updateAnimeFilm) },
      // anime-playlist
      { method: 'GET', path: '/admin/anime-playlists', handler: animePlaylist_controller.getAnimePlaylists },
      { method: 'GET', path: '/admin/anime-playlist/:id', handler: validated_id.validateId(animePlaylist_controller.getAnimePlaylistById ) },
      { method: 'POST', path: '/admin/anime-playlist', handler: animePlaylist_controller.createAnimePlaylist },
      // anime-video
      { method: 'GET', path: '/admin/anime-videos', handler: animeVideo_controller.getAnimeVideos },
      { method: 'POST', path: '/admin/anime-video', handler: animeVideo_controller.createAnimeVideo },
      { method: 'PUT', path: '/admin/anime-video/:id', handler: validated_id.validateId( animeVideo_controller.updateAnimeVideo )},

      // manga
      { method: 'GET', path: '/admin/mangas', handler: manga_controller.getMangas },
      { method: 'POST', path: '/admin/manga', handler: manga_controller.initialManga },
      { method: 'PUT', path: '/admin/manga/images/:id', handler: validated_id.validateId(manga_controller.addImagesToInitializedManga)},
      // manga-tag
      { method: 'GET', path: '/admin/manga-tags', handler: mangaTag_controller.getMangaTags },
      { method: 'POST', path: '/admin/manga-tag', handler: mangaTag_controller.createMangaTag },

      // idols
      { method: 'POST', path: '/admin/idol', handler: idol_controller.CreateIdol },
      // images
      { method: 'POST', path: '/admin/image', handler: image_controller.CreateImage },
      // gallery
      { method: 'POST', path: '/admin/gallery', handler: gallery_controller.CreateGallery },
      // short
      { method: 'POST', path: '/admin/short', handler: short_controller.CreateShort },
      // record
      { method: 'POST', path: '/admin/record', handler: record_controller.CreateRecord },
]


export const handleAdminRoutes = createRouter(adminRoutes);
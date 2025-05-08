import animeStudio_controller from "../controllers/animes/anime-studio.controller.js";
import { createCode, getCode_byId, getCodes, getCodesByStudio } from "../controllers/code.controller.js";
import { createCollection, GetCollection_byId, GetCollections } from "../controllers/collection.controller.js";
import { CreateCreator, creator_controller, DeleteCreator, GetCreators, UpdateCreator } from "../controllers/creator.controller.js";
import { filmController } from "../controllers/film.controller.js";
import playlist_controller from "../controllers/playlist.controller.js";
import studio_controller, { CreateStudio, DeleteStudio, GetStudios, UpdateStudio } from "../controllers/studio.controller.js";
import { getTags, createTag, GetFilmTags, tag_controller } from "../controllers/tag.controller.js";
import video_controller from "../controllers/video.controller.js";
import { Route } from "../interfaces/Route.js";
import { validated_id } from "../middlewares/validate-id.js";
import { createRouter } from "./routes.js";

const adminRoutes: Route[] = [
      // studio 
      { method: 'GET', path: '/admin/studios', handler: GetStudios },
      { method: 'GET', path: '/admin/studio/:id', handler: validated_id.validateId(studio_controller.getStudioById) },
      { method: 'POST', path: '/admin/studio', handler: CreateStudio },
      { method: 'PUT', path: '/admin/studio/:id', handler: validated_id.validateId(UpdateStudio) },
      { method: 'DELETE', path: '/admin/studio/:id', handler: validated_id.validateId(DeleteStudio) },
      // creator
      { method: 'GET', path: '/admin/creators', handler: GetCreators },
      { method: 'GET', path: '/admin/creator/:id', handler: validated_id.validateId(creator_controller.getCreatorById) },
      { method: 'POST', path: '/admin/creator', handler: CreateCreator },
      { method: 'PUT', path: '/admin/creator/:id', handler: validated_id.validateId(UpdateCreator) },
      { method: 'DELETE', path: '/admin/creator/:id', handler: validated_id.validateId(DeleteCreator) },
      // tag
      { method: 'GET', path: '/admin/tags', handler: getTags },
      { method: 'GET', path: '/admin/tag/:id', handler: validated_id.validateId(tag_controller.getTagById) },
      { method: 'GET', path: '/admin/tags/film', handler: GetFilmTags },
      { method: 'GET', path: '/admin/tags/video', handler: tag_controller.getTagsByVideo },
      { method: 'GET', path: '/admin/tags/action', handler: tag_controller.getTagsByAction },
      { method: 'POST', path: '/admin/tag', handler: createTag},
      // code
      { method: 'GET', path: '/admin/codes', handler: getCodes },
      { method: 'GET', path: '/admin/code/:id', handler: validated_id.validateId(getCode_byId) },
      { method: 'GET', path: '/admin/codes/studio/:id', handler: validated_id.validateId(getCodesByStudio) },
      { method: 'POST', path: '/admin/code', handler: createCode },
      // collection
      { method: 'GET', path: '/admin/collections', handler: GetCollections },
      { method: 'GET', path: '/admin/collection/:id', handler: validated_id.validateId(GetCollection_byId) },
      { method: 'POST', path: '/admin/collection', handler: createCollection },
      // film
      { method: 'GET', path: '/admin/films', handler: filmController.getFilms },
      { method: 'GET', path: '/admin/film/:id', handler: validated_id.validateId(filmController.findFilmById) },
      { method: 'GET', path: '/admin/films/studio-code/:studio_id/:code_id', handler: validated_id.validateIds(['studio_id', 'code_id'], filmController.findFilmsByStudioAndCode) },
      { method: 'POST', path: '/admin/film', handler: filmController.createFilm },
      { method: 'PUT', path: '/admin/film/:id', handler: validated_id.validateId(filmController.updateFilm) },
      // video
      { method: 'GET', path: '/admin/videos', handler: video_controller.getVideos },
      { method: 'POST', path: '/admin/video', handler: video_controller.createVideo },
      { method: 'PUT', path: '/admin/video/:id', handler: validated_id.validateId(video_controller.updatedVIdeo ) },
      // playlist
      { method: 'GET', path: '/admin/playlists', handler: playlist_controller.getPlaylists },
      { method: 'GET', path: '/admin/playlist/:id', handler: validated_id.validateId(playlist_controller.findTagById )},
      { method: 'POST', path: '/admin/playlist', handler: playlist_controller.createPlaylist },

      // anime
      { method: 'POST', path: '/admin/anime-studio', handler: animeStudio_controller.createAnimeStudio },
]

export const handleAdminRoutes = createRouter(adminRoutes);
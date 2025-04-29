import { getAdminPage } from "../Admin/Controllers/admin.controller.js";
import { createCode, getCode_byId, getCodes, getCodesByStudio } from "../controllers/code.controller.js";
import { createCollection, GetCollection_byId, GetCollections } from "../controllers/collection.controller.js";
import { CreateCreator, DeleteCreator, GetCreators, UpdateCreator } from "../controllers/creator.controller.js";
import { filmController } from "../controllers/film.controller.js";
import { playlist_controller } from "../controllers/playlist.controller.js";
import { CreateStudio, DeleteStudio, GetStudioById, GetStudios, UpdateStudio } from "../controllers/studio.controller.js";
import { getTags, createTag, GetFilmTags, GetTag_byId, tag_controller } from "../controllers/tag.controller.js";
import { Route } from "../interfaces/Route.js";
import { ValidateId, ValidateIds } from "../middlewares/validate-id.js";
import { createRouter } from "./routes.js";

const adminRoutes: Route[] = [
      { method: 'GET', path: '/admin', handler: getAdminPage },
      // studio 
      { method: 'GET', path: '/admin/studios', handler: GetStudios },
      { method: 'GET', path: '/admin/studio/:id', handler: ValidateId(GetStudioById) },
      { method: 'POST', path: '/admin/studio', handler: CreateStudio },
      { method: 'PUT', path: '/admin/studio/:id', handler: ValidateId(UpdateStudio) },
      { method: 'DELETE', path: '/admin/studio/:id', handler: ValidateId(DeleteStudio) },
      // creator
      { method: 'GET', path: '/admin/creators', handler: GetCreators },
      { method: 'POST', path: '/admin/creator', handler: CreateCreator },
      { method: 'PUT', path: '/admin/creator/:id', handler: ValidateId(UpdateCreator) },
      { method: 'DELETE', path: '/admin/creator/:id', handler: ValidateId(DeleteCreator) },
      // tag
      { method: 'GET', path: '/admin/tags', handler: getTags },
      { method: 'GET', path: '/admin/tag/:id', handler: ValidateId(GetTag_byId) },
      { method: 'GET', path: '/admin/tags/film', handler: GetFilmTags },
      { method: 'GET', path: '/admin/tags/video', handler: tag_controller.getTagsByVideo },
      { method: 'POST', path: '/admin/tag', handler: createTag},
      // code
      { method: 'GET', path: '/admin/codes', handler: getCodes },
      { method: 'GET', path: '/admin/code/:id', handler: ValidateId(getCode_byId) },
      { method: 'GET', path: '/admin/codes/studio/:id', handler: ValidateId(getCodesByStudio) },
      { method: 'POST', path: '/admin/code', handler: createCode },
      // collection
      { method: 'GET', path: '/admin/collections', handler: GetCollections },
      { method: 'GET', path: '/admin/collection/:id', handler: ValidateId(GetCollection_byId) },
      { method: 'POST', path: '/admin/collection', handler: createCollection },
      // playlist
      { method: 'GET', path: '/admin/playlists', handler: playlist_controller.getPlaylists },
      { method: 'POST', path: '/admin/playlist', handler: playlist_controller.createPlaylist },
      // film
      { method: 'GET', path: '/admin/films', handler: filmController.getFilms },
      { method: 'GET', path: '/admin/films/studio-code/:studio_id/:code_id', handler: ValidateIds(['studio_id', 'code_id'], filmController.findFilmsByStudioAndCode) },
      { method: 'POST', path: '/admin/film', handler: filmController.createFilm },
      { method: 'PUT', path: '/admin/film/:id', handler: ValidateId(filmController.updateFilm) },
]

export const handleAdminRoutes = createRouter(adminRoutes);
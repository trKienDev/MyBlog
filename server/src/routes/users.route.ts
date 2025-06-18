import code_controller from "../controllers/code.controller.js";
import { creator_controller } from "../controllers/creator.controller.js";
import { filmController } from "../controllers/film.controller.js";
import playlist_controller from "../controllers/playlist.controller.js";
import studio_controller from "../controllers/studio.controller.js";
import { tag_controller } from "../controllers/tag.controller.js";
import video_controller from "../controllers/video.controller.js";
import { Route } from "../interfaces/Route.js";
import { validated_id } from "../middlewares/validate-id.js";
import { createRouter } from "./routes.js";

const user_routes: Route[] = [
      // codes
      { method: 'GET', path: '/api/codes/studio/:id', handler: validated_id.validateId(code_controller.GetCodesByStudio) },
      // creators
      { method: 'GET', path: '/creators', handler: creator_controller.GetCreators },

      // films
      { method: 'GET', path: '/films', handler: filmController.getFilms },
      { method: 'GET', path: '/films/creator/:id', handler: validated_id.validateId( filmController.FindFIlmsByCreator )},
      { method: 'GET', path: '/films/studio/:id', handler: validated_id.validateId( filmController.FindFilmsByStudio )},

      // studios
       { method: 'GET', path: '/studios', handler: studio_controller.GetStudios },

      // tag
      { method: 'GET', path: '/api/tags', handler: tag_controller.GetTags },
      { method: 'GET', path: '/api/tags/creator', handler: tag_controller.getTagsByCreator },
      { method: 'GET', path: '/api/tags/film', handler: tag_controller.GetTagsByFilm },
      { method: 'GET', path: '/api/tags/video', handler: tag_controller.getTagsByVideo },
      // playlist
      { method: 'GET', path: '/playlists', handler: playlist_controller.getPlaylists },

      // video
      { method: 'GET', path: '/video/:id', handler: validated_id.validateId(video_controller.findVideoById)},
      { method: 'GET', path: '/videos/creator/:id', handler: validated_id.validateId(video_controller.findVideosByCreatorId)},
      { method: 'PUT', path: '/video/:id/playlists', handler: validated_id.validateId(video_controller.addPlaylistToVideo )},
      { method: 'PUT', path: '/video/view/:id', handler: validated_id.validateId(video_controller.increaseVideoViewsByOne )},
      { method: 'PUT', path: '/video/:id/like', handler: validated_id.validateId(video_controller.increaseVideoLikeByOne )},
      { method: 'GET', path: '/videos/paginated', handler: video_controller.getVIdeosPaginated },
]

export const handleUserRoutes = createRouter(user_routes);
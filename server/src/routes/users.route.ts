import { creator_controller } from "../controllers/creator.controller.js";
import { filmController } from "../controllers/film.controller.js";
import playlist_controller from "../controllers/playlist.controller.js";
import { tag_controller } from "../controllers/tag.controller.js";
import video_controller from "../controllers/video.controller.js";
import { Route } from "../interfaces/Route.js";
import { validated_id } from "../middlewares/validate-id.js";
import { createRouter } from "./routes.js";

const user_routes: Route[] = [
      // creators
      { method: 'GET', path: '/creators', handler: creator_controller.GetCreators },

      // films
      { method: 'GET', path: '/films/creator/:id', handler: validated_id.validateId( filmController.FindFIlmsByCreator )},

      // playlist
      { method: 'GET', path: '/playlists', handler: playlist_controller.getPlaylists },

      // video
      { method: 'GET', path: '/video/:id', handler: validated_id.validateId(video_controller.findVideoById)},
      { method: 'GET', path: '/videos/creator/:id', handler: validated_id.validateId(video_controller.findVideosByCreatorId)},
      { method: 'PUT', path: '/video/:id/playlists', handler: validated_id.validateId(video_controller.addPlaylistToVideo )},
      { method: 'PUT', path: '/video/view/:id', handler: validated_id.validateId(video_controller.increaseVideoViewsByOne )},
      { method: 'PUT', path: '/video/:id/like', handler: validated_id.validateId(video_controller.increaseVideoLikeByOne )},

      // tag
      { method: 'GET', path: '/tags/creator', handler: tag_controller.getTagsByCreator },
]

export const handleUserRoutes = createRouter(user_routes);
import { creator_controller } from "../controllers/creator.controller.js";
import playlist_controller from "../controllers/playlist.controller.js";
import video_controller from "../controllers/video.controller.js";
import { Route } from "../interfaces/Route.js";
import { validated_id } from "../middlewares/validate-id.js";
import { createRouter } from "./routes.js";

const user_routes: Route[] = [
      // video
      { method: 'GET', path: '/video/:id', handler: validated_id.validateId(video_controller.findVideoById)},
      { method: 'GET', path: '/videos/creator/:id', handler: validated_id.validateId(video_controller.findVideosByCreatorId)},
      { method: 'PUT', path: '/video/:id/playlists', handler: validated_id.validateId(video_controller.addPlaylistToVideo )},
      { method: 'PUT', path: '/video/view/:id', handler: validated_id.validateId(video_controller.increaseVideoViewsByOne )},
      { method: 'PUT', path: '/video/:id/like', handler: validated_id.validateId(video_controller.increaseVideoLikeByOne )},

      // creators
      { method: 'GET', path: '/creators', handler: creator_controller.GetCreators },

      // playlist
      { method: 'GET', path: '/playlists', handler: playlist_controller.getPlaylists },
]

export const handleUserRoutes = createRouter(user_routes);
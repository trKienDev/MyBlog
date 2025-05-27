import video_controller from "../controllers/video.controller.js";
import { Route } from "../interfaces/Route.js";
import { validated_id } from "../middlewares/validate-id.js";
import { createRouter } from "./routes.js";

const user_routes: Route[] = [
      // video
      { method: 'GET', path: '/video/:id', handler: validated_id.validateId(video_controller.findVideoById ) },

]


export const handleUserRoutes = createRouter(user_routes);
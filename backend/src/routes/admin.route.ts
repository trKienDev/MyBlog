import { getAdminPage } from "../Admin/Controllers/admin.controller.js";
import { CreateCreator, GetCreators, UpdateCreator } from "../controllers/creator.controller.js";
import { CreateStudio, DeleteStudio, GetStudios, UpdateStudio } from "../controllers/studio.controller.js";
import { Route } from "../interfaces/Route.js";
import { createRouter } from "./routes.js";

const adminRoutes: Route[] = [
      { method: 'GET', path: '/admin', handler: getAdminPage },
      // studio 
      { method: 'GET', path: '/admin/studios', handler: GetStudios },
      { method: 'POST', path: '/admin/studio', handler: CreateStudio },
      { method: 'PUT', path: '/admin/studio/:id', handler: UpdateStudio },
      { method: 'DELETE', path: '/admin/studio/:id', handler: DeleteStudio },

      // creator
      { method: 'GET', path: '/admin/creators', handler: GetCreators },
      { method: 'POST', path: '/admin/creator', handler: CreateCreator },
      { method: 'PUT', path: '/admin/creator/:id', handler: UpdateCreator },
]

export const handleAdminRoutes = createRouter(adminRoutes);
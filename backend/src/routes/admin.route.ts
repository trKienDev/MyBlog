import { getAdminPage } from "../Admin/Controllers/admin.controller.js";
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
      // { method: 'POST', path: '/admin/creator', handle}
]

export const handleAdminRoutes = createRouter(adminRoutes);
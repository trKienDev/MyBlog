import { getAdminPage } from "../Admin/Controllers/admin.controller.js";
import { CreateStudio, GetStudios, UpdateStudio } from "../controllers/studio.controller.js";
import { Route } from "../interfaces/Route.js";
import { createRouter } from "./routes.js";

const adminRoutes: Route[] = [
      { method: 'GET', path: '/admin', handler: getAdminPage },
      { method: 'GET', path: '/admin/studios', handler: GetStudios },
      { method: 'POST', path: '/admin/studio', handler: CreateStudio },
      { method: 'PUT', path: '/admin/studio', handler: UpdateStudio },
      // { method: 'DELETE', path: '/admin/studio', handler:}
      // { method: 'GET', path: '/admin/creators', handler: getAllActresses },
]

export const handleAdminRoutes = createRouter(adminRoutes);
import { getAdminPage } from "../Admin/Controllers/admin.controller.js";
import { CreateStudio, GetStudios } from "../controllers/studio.controller.js";
import { Route } from "../interfaces/Route.js";
import { createRouter } from "./routes.js";

const adminRoutes: Route[] = [
      { method: 'GET', path: '/admin', handler: getAdminPage },
      { method: 'POST', path: '/admin/studio', handler: CreateStudio },
      { method: 'GET', path: '/admin/studios', handler: GetStudios },
      // { method: 'GET', path: '/admin/creators', handler: getAllActresses },
]

export const handleAdminRoutes = createRouter(adminRoutes);
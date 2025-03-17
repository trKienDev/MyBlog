import { getAdminPage } from "../Admin/Controllers/admin.controller.js";
import { Route } from "../interfaces/Route.js";
import { createRouter } from "./routes.js";

const adminRoutes: Route[] = [
      { method: 'GET', path: '/admin', handler: getAdminPage },
      // { method: 'GET', path: '/admin/creators', handler: getAllActresses },
]

export const handleAdminRoutes = createRouter(adminRoutes);
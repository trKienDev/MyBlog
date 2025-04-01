import { getAdminPage } from "../Admin/Controllers/admin.controller.js";
import { createCode } from "../controllers/code.controller.js";
import { CreateCreator, DeleteCreator, GetCreators, UpdateCreator } from "../controllers/creator.controller.js";
import { CreateStudio, DeleteStudio, GetStudios, UpdateStudio } from "../controllers/studio.controller.js";
import { getTags, createTag } from "../controllers/tag.controller.js";
import { Route } from "../interfaces/Route.js";
import { ValidateId } from "../middlewares/validateId.js";
import { createRouter } from "./routes.js";

const adminRoutes: Route[] = [
      { method: 'GET', path: '/admin', handler: getAdminPage },
      // studio 
      { method: 'GET', path: '/admin/studios', handler: GetStudios },
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
      { method: 'POST', path: '/admin/tag', handler: createTag},
      // code
      { method: 'POST', path: '/admin/code', handler: createCode },
]

export const handleAdminRoutes = createRouter(adminRoutes);
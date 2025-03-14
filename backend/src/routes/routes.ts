import { IncomingMessage, ServerResponse } from "http";
import { handleAdminRoutes } from "./admin.route.js";
import userRoutes from "./users.route.js";
import { Route } from "../interfaces/Route.js";

export function handleRoutes(req: IncomingMessage, res: ServerResponse) {
      // admin
      if(req.url?.startsWith('/admin')) {
            handleAdminRoutes(req, res);
            return;
      }

      // users
      if(req.url?.startsWith('/')) {
            userRoutes(req, res);
            return;
      }

      res.statusCode = 404;
      res.end('Route nor found');
}

export function createRouter(routes: Route[]) {
      return function(req: IncomingMessage, res: ServerResponse) {
            const { url, method } =req;
            console.log("url: ", url);
            console.log("method: ", method);
            const matchedRoute = routes.find(route => route.path === url && route.method === method);
            console.log("matchedRoute: ", matchedRoute);
            if(matchedRoute) {
                  matchedRoute.handler(req, res);
            } else {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'text/plain');
                  res.end('Not found');
            }
      };
}
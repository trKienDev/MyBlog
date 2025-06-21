import { ServerResponse } from "http";
import { handleAdminRoutes } from "./admin.route.js";
import { Route } from "../interfaces/Route.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { handleUserRoutes } from "./users.route.js";

export function handleRoutes(req: CustomRequest, res: ServerResponse) {
      // admin
      if(req.url?.startsWith('/admin')) {
            handleAdminRoutes(req, res);
            return;
      }

      // users
      if(req.url?.startsWith('/')) {
            handleUserRoutes(req, res);
            return;
      }
      console.error("Error handleRoutes in route.ts");
      res.statusCode = 404;
      res.end('Route nor found');
}

export function createRouter(routes: Route[]) {
      return function(req: CustomRequest, res: ServerResponse) {
            const { url, method } = req;
            const [pathname, query_string] = url ? url.split('?') : [''];
            const matchedRoute = routes.find(route => {
                  const routeSegments = route.path.split('/');
                  const pathSegments = pathname.split('/');

                  if(route.method !== method)  return false;
                  if(routeSegments.length !== pathSegments.length) return false;

                  for(let i = 0; i < routeSegments.length; i++) {
                        if(routeSegments[i].startsWith(':')) continue;
                        if(routeSegments[i] !== pathSegments[i]) return false;
                  }

                  return true;
            });
            if(matchedRoute) {
                  const routeSegments = matchedRoute.path.split('/');
                  const pathSegments = pathname.split('/');
                  const params: any = {};
                  for(let i = 0; i < routeSegments.length; i++) {
                        if(routeSegments[i].startsWith(':')) {
                              const paramName = routeSegments[i].slice(1);
                              params[paramName] = pathSegments[i];
                        }
                  }

                  req.params = params;

                  const query: any = {};
                  if(query_string) {
                        const search_params = new URLSearchParams(query_string);
                        for(const [key, value] of search_params.entries()) {
                              query[key] = value;
                        }
                  }
                  req.query = query;
                  matchedRoute.handler(req, res);
            } else {
                  console.log('url: ', url);
                  console.log('method: ', method);
                  console.error("route does not matched in createRoute - routes.ts");
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'text/plain');
                  res.end('Not found');
            }
      }
}
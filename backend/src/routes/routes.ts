import { ServerResponse } from "http";
import { handleAdminRoutes } from "./admin.route.js";
import userRoutes from "./users.route.js";
import { Route } from "../interfaces/Route.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";

export function handleRoutes(req: CustomRequest, res: ServerResponse) {
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
      console.error("Error handleRoutes in route.ts");
      res.statusCode = 404;
      res.end('Route nor found');
}

export function createRouter(routes: Route[]) {
      return function(req: CustomRequest, res: ServerResponse) {
            const { url, method } = req;
            // Tách query string (nếu có) khỏi url
            const [pathname] = url ? url.split('?') : [''];

            // console.log("pathname: ", pathname);
            // Duyệt qua danh sách routes để tìm route phù hợp
            const matchedRoute = routes.find(route => {
                  // Tách route.path và pathname thành các segment
                  const routeSegments = route.path.split('/');
                  const pathSegments = pathname.split('/');

                  // so sánh method
                  if(route.method !== method)  return false;

                  // so sánh độ dài segment
                  if(routeSegments.length !== pathSegments.length) return false;

                  // so khớp từng segment
                  for(let i = 0; i < routeSegments.length; i++) {
                        // nếu segment dạng :id thì bỏ qua, coi như match
                        if(routeSegments[i].startsWith(':')) continue;
                        
                        // nếu segment thường thì phải khớp chính xác
                        if(routeSegments[i] !== pathSegments[i]) return false;
                  }

                  return true;
            });

            if(matchedRoute) {
                  // Nếu có tham số, ví dụ /admin/studio/:id
                  // thì tách ra để truyền vào req (nếu cần)
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
                  matchedRoute.handler(req, res);
            } else {
                  console.error("route does not matched in createRoute - routes.ts");
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'text/plain');
                  res.end('Not found');
            }
      }
}
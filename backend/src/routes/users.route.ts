import { IncomingMessage, ServerResponse } from 'http';
import { getHomePage } from '../controllers/home.controller.js';
import { getFilmByTagId } from '../Admin/Controllers/film.controller.js';
import { CustomRequest } from '../interfaces/CustomRequest.js';

// APIs
export const userRoutes = (req: IncomingMessage, res: ServerResponse) => {
      const { url, method } = req;
      if (req.url === '/' && req.method === 'GET') {
            getHomePage(req, res);
      } 
      // film
      else if(url?.startsWith ( '/film/tag' ) && method === 'GET'){
            getFilmByTagId(req as CustomRequest, res);
      } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('User Route Not Found');
      }
}

export default userRoutes;
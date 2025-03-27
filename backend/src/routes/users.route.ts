import { IncomingMessage, ServerResponse } from 'http';
import { getHomePage } from '../controllers/home.controller.js';
import { CustomRequest } from '../interfaces/CustomRequest.js';

// APIs
export const userRoutes = (req: IncomingMessage, res: ServerResponse) => {
      const { url, method } = req;
      if (req.url === '/' && req.method === 'GET') {
            getHomePage(req, res);
      } 

      else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('User Route Not Found');
      }
}

export default userRoutes;
import { IncomingMessage, ServerResponse } from 'http';
import { getHomePage } from '../controllers/home.controller.js';

// APIs
export const userRoutes = (req: IncomingMessage, res: ServerResponse) => {
        if (req.url === '/' && req.method === 'GET') {
                getHomePage(req, res);
        } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('User Route Not Found');
        }
    }
    
    export default userRoutes;
import { IncomingMessage, ServerResponse } from 'http';
import { getAboutPage } from '../src/Admin/Controllers/about.controller.js';
import { getHomePage } from '../src/controllers/home.controller.js';
import { getAdminPage } from '../src/Admin/Controllers/admin.controller.js';

// APIs
export const handleRoutes = (req : IncomingMessage, res : ServerResponse) => {
        if (req.url === '/' && req.method === 'GET') {
                getHomePage(req, res);
        } else if(req.url === '/about' && req.method === 'GET') {
                getAboutPage(req, res); 
        } else if (req.url === '/admin' && req.method === 'GET') {
                getAdminPage(req, res);
        } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Not Found')
        }
}

export default handleRoutes;


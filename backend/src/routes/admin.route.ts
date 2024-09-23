import { IncomingMessage, ServerResponse } from 'http';
import { getAdminPage } from '../Admin/Controllers/admin.controller.js';
import { getAboutPage } from '../Admin/Controllers/about.controller.js';

export const adminRoutes = (req: IncomingMessage, res: ServerResponse) => {
        if (req.url === '/admin' && req.method === 'GET') {
                getAdminPage(req, res);
        } else if (req.url === '/about' && req.method === 'GET') {
                getAboutPage(req, res);
        } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Admin Route Not Found');
        }
}

export default adminRoutes;

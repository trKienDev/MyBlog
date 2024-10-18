import { IncomingMessage, ServerResponse } from 'http';
import { getAdminPage } from '../Admin/Controllers/admin.controller.js';
import { getAboutPage } from '../Admin/Controllers/about.controller.js';
import { getSidebarItems, createSidebarItem, deleteSidebarItem, updateSidebarItem } from '../Admin/Controllers/sidebar.controller.js';
import { getActress, createActress, updateActress, deleteActress } from '../Admin/Controllers/actress.controller.js';

export const adminRoutes = (req: IncomingMessage, res: ServerResponse) => {
        // Extract the URL and method from the request
        const { url, method } = req;

        if ( url === '/admin' && method === 'GET' ) {
                getAdminPage(req, res);
        } else if ( url === '/about' && method === 'GET' ) {
                getAboutPage(req, res);
        } 
        // sidebar
        else if ( url === '/admin/sidebar' && method === 'GET' ) { // Route for getting all sidebar items
                getSidebarItems ( req, res );
        } else if ( url === '/admin/sidebar/create' && method === 'POST' ) { // Route for creating a new sidebar item
                createSidebarItem ( req, res );
        } else if ( url?.startsWith ( '/admin/sidebar/update' ) && method === 'PUT' ) {
                updateSidebarItem ( req, res );
        } else if ( url?.startsWith ( '/admin/sidebar/delete' ) && method === 'DELETE' ) {
                deleteSidebarItem ( req, res );
        } 
        // actress 
        else if ( url?.startsWith ( '/admin/actresses' ) && method === 'GET' ) {
                getActress ( req , res );
        } else if ( url?.startsWith ( '/admin/actress/create' ) && method === 'POST' ) {
                createActress ( req , res );
        } else if ( url?.startsWith ( '/admin/actress/update' ) && method === 'PUT' ) {
                updateActress ( req , res );
        } else if ( url?.startsWith ( '/admin/actress/delete' ) && method === 'DELETE' ) {
                deleteActress ( req , res ); 
        }

        else { // Handle invalid routes
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Admin Route Not Found');
        }


}

export default adminRoutes;

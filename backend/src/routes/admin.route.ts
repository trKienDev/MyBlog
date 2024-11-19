import { IncomingMessage, ServerResponse } from 'http';
import { getAdminPage } from '../Admin/Controllers/admin.controller.js';
import { getAboutPage } from '../Admin/Controllers/about.controller.js';
import { getCodeAV, createCodeAV, updateCodeAV, deleteCodeAV } from '../Admin/Controllers/codeAV.controller.js';
import { getSidebarItems, createSidebarItem, deleteSidebarItem, updateSidebarItem } from '../Admin/Controllers/sidebar.controller.js';
import { getActress, createActress, updateActress, deleteActress } from '../Admin/Controllers/actress.controller.js';
import { getStudio, createStudio, updateStudio, deleteStudio } from '../Admin/Controllers/studio.controller.js';
import { CustomRequest } from "../interfaces/CustomRequest.js";

export const adminRoutes = (req: IncomingMessage, res: ServerResponse) => {
        // Extract the URL and method from the request
        const { url, method } = req;

        // pages
        if ( url === '/admin' && method === 'GET' ) {
                getAdminPage(req, res);
        } else if ( url === '/about' && method === 'GET' ) {
                getAboutPage(req, res);
        } 
        // sidebar
        else if ( url === '/admin/sidebar/read' && method === 'GET' ) { // Route for getting all sidebar items
                getSidebarItems ( req, res );
        } else if ( url === '/admin/sidebar/create' && method === 'POST' ) { // Route for creating a new sidebar item
                createSidebarItem ( req, res );
        } else if ( url?.startsWith ( '/admin/sidebar/update' ) && method === 'PUT' ) {
                updateSidebarItem ( req, res );
        } else if ( url?.startsWith ( '/admin/sidebar/delete' ) && method === 'DELETE' ) {
                deleteSidebarItem ( req, res );
        } 
        // actress 
        else if ( url?.startsWith ( '/admin/actress/read' ) && method === 'GET' ) {
                getActress ( req , res );
        } else if ( url?.startsWith ( '/admin/actress/create' ) && method === 'POST' ) {
                createActress ( req as CustomRequest, res );
        } else if ( url?.startsWith ( '/admin/actress/update' ) && method === 'PUT' ) {
                updateActress ( req as CustomRequest, res );
        } else if ( url?.startsWith ( '/admin/actress/delete' ) && method === 'DELETE' ) {
                deleteActress ( req , res ); 
        }
        // studio
        else if ( url?.startsWith ( '/admin/studio/read' ) && method === 'GET' ) {
                getStudio ( req as CustomRequest, res );
        } else if ( url?.startsWith ( '/admin/studio/create' ) && method === 'POST' ) {
                createStudio ( req as CustomRequest, res );
        } else if ( url?.startsWith ( '/admin/studio/update' ) && method === 'PUT' ) {
                updateStudio ( req as CustomRequest, res );
        } else if ( url?.startsWith ( '/admin/studio/delete' ) && method === 'DELETE' ) {
                deleteStudio ( req , res ); 
        }
        // codeAV
        else if ( url?.startsWith ( '/admin/codeAV/read' ) && method === 'GET' ) {
                getCodeAV ( req , res );
        } else if ( url?.startsWith ( '/admin/codeAV/create' ) && method === 'POST' ) {
                createCodeAV ( req as CustomRequest, res );
        } else if ( url?.startsWith ( '/admin/codeAV/update' ) && method === 'PUT' ) {
                updateCodeAV ( req as CustomRequest, res );
        } else if ( url?.startsWith ( '/admin/codeAV/delete' ) && method === 'DELETE' ) {
                deleteCodeAV ( req , res ); 
        }

        else { // Handle invalid routes
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Admin Route Not Found');
        }


}

export default adminRoutes;

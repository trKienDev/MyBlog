import { IncomingMessage, ServerResponse } from "http";
import SidebarItem from "../models/sidebar-item.model.js";

// Lấy tất cả các sidebar item
export const getSidebarItems = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const sidebarItems = await SidebarItem.find(); // Lấy dữ liệu từ MongoDB
                
                res.statusCode = 200; // Set the status 
                res.setHeader('Content-Type',  'application/json'); // Set the content-type header to JSON
                res.end(JSON.stringify(sidebarItems)); // Send the response as JSON string
        } catch(error) {
                // Handle errors, set status code to 500 for server error
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');

                res.end(JSON.stringify({ message: 'Server Error', error })); // Send the error message
        }
};

// Tạo thêm menu item
export const createSidebarItem = async(req: IncomingMessage, res: ServerResponse) => {
        let body = '';
        // listen for the 'data' event to collect chunks of the request body
        req.on('data', chunk => {
                body += chunk.toString(); // Append data chunk
        });
        // When the request is finished (end event), parse the body and process it
        req.on('end', async() => {
                try {
                        const { icon, name } = JSON.parse(body); // Parse the body data (which should be JSON)
                        
                        // Create a new sidebar item using the parsed data
                        const newItem = new SidebarItem({ icon, name }); 
                        await newItem.save();

                        // Send the response with status 201 (created) and the new created item
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(newItem));
                } catch (error) {
                        // Handle errors, set status code to 500 for server error
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Error creating item', error }));
                }
        });
}

// Xoá sidebar item
export const deleteSidebarItem = async(req: IncomingMessage, res: ServerResponse) => {
        // Extract the ID from the URL or request
        const id = req.url?.split("/").pop(); // Assumes the ID is passed in the URL, e.g., /api/sidebar-items/{id}
        // Regular expression to check if the ID is a valid MongoDB ObjectId (24 hex characters)
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if(!id) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "ID is requested" }));
                return;
        }
        // Check if the ID is valid
        if (!objectIdPattern.test(id)) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Invalid ID format" }));
                return;
        }
        try {
                // Find the sidebar item by ID and delete it
                const deletedItem = await SidebarItem.findByIdAndDelete(id);
                if(!deletedItem) {
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: "Sidebar item not found" }));
                        return;
                }
                // Send a success response with the deleted item
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Sidebar item deleted", deletedItem }));
        } catch(error) {
                // Handle erros, set status code to 500 for server error
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Error deleting item", error }));
        }
};
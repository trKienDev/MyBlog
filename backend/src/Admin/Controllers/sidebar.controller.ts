import { IncomingMessage, ServerResponse } from "http";
import SidebarItem from "../models/sidebar-item.model.js";
import { sendResponse, sendError } from "../../helperFunction/response.js"

// Lấy tất cả các sidebar item
export const getSidebarItems = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const sidebarItems = await SidebarItem.find(); // Lấy dữ liệu từ MongoDB
                
                return sendResponse(res, 200, sidebarItems);
        } catch(error) {
                return sendError(res, 500, error);
        }
};

// Tạo thêm menu item
export const createSidebarItem = async (req: IncomingMessage, res: ServerResponse) => {
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

                        return sendResponse(res, 201, newItem);
                } catch (error) {
                        return sendError(res, 500, error);
                }
        });
}

// Xoá sidebar item
export const deleteSidebarItem = async (req: IncomingMessage, res: ServerResponse) => {
        // Extract the ID from the URL or request
        const id = req.url?.split("/").pop(); // Assumes the ID is passed in the URL, e.g., /api/sidebar-items/{id}
        // Regular expression to check if the ID is a valid MongoDB ObjectId (24 hex characters)
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if(!id) {
                return sendError(res, 400, new Error("ID is required"));
        }
        // Check if the ID is valid
        if (!objectIdPattern.test(id)) {
                return sendError(res, 400, new Error("Invalid ID format"));
        }
        
        try {
                // Find the sidebar item by ID and delete it
                const deletedItem = await SidebarItem.findByIdAndDelete(id);
                if(!deletedItem) {
                        return sendError(res, 404, new Error("Sidebar item not found"));
                }

                return sendResponse(res, 200, {
                        message: "Sidebar item deleted successfully",
                        deletedItem,
                });
        } catch(error) {
                return sendError(res, 500, error);
        }
};

// Cập nhật các sidebar item
export const updateSidebarItem = async (req: IncomingMessage, res: ServerResponse) => {
        // Extract the ID from the URL
        const id = req.url?.split("/").pop(); 

        // Validate ID
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if (!id) {
                return sendError(res, 400, new Error("ID is required"));
        }

        // Check if the ID is valid
        if (!objectIdPattern.test(id)) {
                return sendError(res, 400, new Error("Invalid ID format"));
        }

        let body = '';
        req.on('data', chunk => {
                body += chunk.toString(); 
        });

        req.on('end', async () => {
                try {
                        const { icon, name } = JSON.parse(body);

                        // validate input data
                        if (!icon || !name) {
                                return sendError(res, 400, new Error("Both 'icon' and 'name' fields are required"));
                        }

                        // Find the sidebar item by ID and update it
                        const updateItem = await SidebarItem.findByIdAndUpdate(id, {icon, name}, {new: true});
                        
                        if (!updateItem) {
                                return sendError(res, 404, new Error("Sidebar item not found!"));
                        }

                        return sendResponse(res, 200, {
                                message: "Sidebar item updated successfully",
                                updateItem,
                        });
                }
                catch (error) {
                        return sendError(res, 500, error);
                }
        });
}
import { IncomingMessage, ServerResponse } from 'http';
import TagModel from "../models/tag.model.js";
import { sendResponse, sendError } from "../../helperFunction/response.js";

export const getTags = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const tagItem = await TagModel.find(); 
                
                return sendResponse(res, 200, tagItem);
        } catch(error) {
                return sendError(res, 500, error);
        }
};

export const createTag = async (req: IncomingMessage, res: ServerResponse ) => {
        let body = '';
        req.on('data', chunk => {
                body += chunk.toString();
        });

        req.on('end', async() => {
                try {
                        const { name, kind } = JSON.parse(body); 
                        const newTag = new TagModel({ name, kind }); 
                        await newTag.save();

                        return sendResponse(res, 201, newTag);
                } catch (error) {
                        return sendError(res, 500, error);
                }
        });
};

export const updateTag = async (req: IncomingMessage, res: ServerResponse) => {
        const id = req.url?.split("/").pop(); 
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if (!id) {
                return sendError(res, 400, new Error("ID is required"));
        }
        if (!objectIdPattern.test(id)) {
                return sendError(res, 400, new Error("Invalid ID format"));
        }

        let body = '';
        req.on('data', chunk => {
                body += chunk.toString(); 
        });

        req.on('end', async () => {
                try {
                        const { name, kind } = JSON.parse(body);

                        if (!name || !kind) {
                                return sendError(res, 400, new Error("Both 'name' and 'kind' fields are required"));
                        }

                        // Find the sidebar item by ID and update it
                        const updateItem = await TagModel.findByIdAndUpdate(id, {name, kind}, {new: true});
                        
                        if (!updateItem) {
                                return sendError(res, 404, new Error("Tag is not found!"));
                        }
                        return sendResponse(res, 200, {
                                message: "Tag is updated successfully",
                                updateItem,
                        });
                }
                catch (error) {
                        return sendError(res, 500, error);
                }
        });
}

export const deleteTag = async (req: IncomingMessage, res: ServerResponse) => {
        const id = req.url?.split("/").pop(); 
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if(!id) {
                return sendError(res, 400, new Error("ID is required"));
        }
        if (!objectIdPattern.test(id)) {
                return sendError(res, 400, new Error("Invalid ID format"));
        }
        
        try {
                const deletedItem = await TagModel.findByIdAndDelete(id);
                if(!deletedItem) {
                        return sendError(res, 404, new Error("Tag is not found"));
                }

                return sendResponse(res, 200, {
                        message: "Tag is deleted successfully",
                        deletedItem,
                });
        } catch(error) {
                return sendError(res, 500, error);
        }
};
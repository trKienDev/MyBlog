import { IncomingMessage, ServerResponse } from 'http';
import StoryModel from "../models/story.model.js";
import { sendResponse, sendError } from "../../helperFunction/response.js";

export const createStory = async (req: IncomingMessage, res: ServerResponse ) => {
        let body = '';
        req.on('data', chunk => {
                body += chunk.toString();
        });

        req.on('end', async() => {
                try {
                        const bodyData = JSON.parse(body);
                        const { name, role_actress, role_actor, motip, detail } = bodyData;
                        
                        if (!name || !role_actress || !role_actor || !motip || !detail ) {
                                return sendError(res, 400, 'Invalid or missing fields');
                        }
                        
                        const newStory = new StoryModel({ name, role_actress, role_actor, motip, detail });
                        await newStory.save();

                        return sendResponse(res, 201, newStory);
                } catch (error) {
                        console.log("Error: ", error);
                        return sendError(res, 500, error);
                }
        });
};

export const getStory = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const stories = await StoryModel.find();
                sendResponse(res, 200, stories);
        } catch(error) {
                console.error('Error getting stories: ', error);
                sendError(res, 500, new Error('Error retrieving stories from the database.'));
        }
};

export const updateStory = async (req: IncomingMessage, res: ServerResponse) => {
        const id = req.url?.split("/").pop();
        const objectIdPattern = /^[a-f\d]{24}$/i;
        if(!id) {
                return sendError(res, 400, new Error("ID is required"));
        }
        // if(objectIdPattern.test(id)) {
        //         return sendError(res, 400, new Error("Invalid ID format"));
        // }

        let body = '';
        req.on('data', chunk => {
                body += chunk.toString(); 
        });

        req.on('end', async () => {
                try {
                        const  { name, role_actress, role_actor, motip, detail } = JSON.parse(body);

                        // Find the story item by ID and update it
                        const updateItem = await StoryModel.findByIdAndUpdate(id, { name, role_actress, role_actor, motip, detail }, {new: true});
                        if(!updateItem) {
                                return sendError(res, 404, new Error("Story is not found!"));
                        }

                        return sendResponse(res, 200, {
                                message: "Story is updated successfully",
                                updateItem,
                        });
                } catch (error) {
                        return sendError(res, 500, error);
                }
        });
}

export const deleteStory = async (req: IncomingMessage, res: ServerResponse) => {
        const id = req.url?.split("/").pop(); 
        if(!id) {
                return sendError(res, 400, new Error("ID is required"));
        }

        try {
                const deletedItem = await StoryModel.findByIdAndDelete(id);
                if(!deletedItem) {
                        return sendError(res, 404, new Error("Story is not found!"));
                }

                return sendResponse(res, 200, {
                        message: "Story is deleted successfully",
                        deletedItem,
                });
        } catch (error) {
                return sendError(res, 500, error);
        }
} ;
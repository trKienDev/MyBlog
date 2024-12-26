import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import StudioModel from "../models/studio.model.js";
import { sendResponse, sendError } from "../../helperFunction/response.js";
import { handleUpload } from '../../helperFunction/uploadFile.js';
import path from 'path';
import fs from 'fs';


const studioUploadPath = path.join(process.cwd(), "..", "..", "uploads","studio");

export const getStudio = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const studios = await StudioModel.find();
                sendResponse(res, 200, studios);
        } catch (error) {
                console.error('Error retrieving studios:', error);
                sendError(res, 500, new Error('Error retrieving studios from the database.'));
        }
};

export const createStudio = async (req: CustomRequest, res: ServerResponse) => {
        try {
                await handleUpload(req, studioUploadPath);
                const { name } = (req as any).body;

                const existingStudio = await StudioModel.findOne({ name });
                if (existingStudio) {
                        return sendResponse(res, 409, { message: 'Studio with this name already exists.' });
                }
                
                let imageName = '';
                if ((req as any).file) {
                        imageName = (req as any).file.filename;
                }

                const newStudio = new StudioModel({
                        name,
                        image: imageName 
                });
                await newStudio.save();

                sendResponse(res, 201, newStudio)
        } catch (error) {
                console.error('Unexpected error:', error);
                return sendError(res, 500, error);
        }
};

export const updateStudio = async (req: CustomRequest, res: ServerResponse) => {
        try {
                await handleUpload(req, studioUploadPath);

                const { id, name } = (req as any).body;
                const studio = await StudioModel.findById(id);

                if (!studio) {
                        return sendError(res, 404, new Error('Studio not found.'));
                }

                let newImageName = studio.image; // Keep old image if no new image uploaded

                if ((req as any).file) {
                        // Delete old image if exists
                        if (studio.image) {
                                const oldImagePath = path.join(studioUploadPath, studio.image);
                                if (fs.existsSync(oldImagePath)) {
                                        fs.unlinkSync(oldImagePath);
                                }
                        }
                        newImageName = (req as any).file.filename;
                }

                // Update studio
                studio.name = name;
                studio.image = newImageName;
                await studio.save();

                sendResponse(res, 200, studio);
        } catch (error) {
                console.error('Error updating studio:', error);
                sendError(res, 500, new Error('Error updating studio.'));
        }
};

export const deleteStudio = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const urlPath = req.url?.split('/');
                const studioId = urlPath?.[urlPath.length - 1];
                
                const studio = await StudioModel.findById(studioId);
    
                if (!studio) {
                        return sendError(res, 404, new Error('Studio not found.'));
                }
    
                if (studio.image) {
                        const imagePath = path.join(studioUploadPath, studio.image);
                        if (fs.existsSync(imagePath)) {
                                fs.unlinkSync(imagePath);
                        }
                }
    
                await StudioModel.findByIdAndDelete(studioId);
    
                sendResponse(res, 200, { message: 'Studio deleted successfully' });
        } catch (error) {
                console.error('Error deleting studio:', error);
                sendError(res, 500, new Error('Error deleting studio.'));
        }
};
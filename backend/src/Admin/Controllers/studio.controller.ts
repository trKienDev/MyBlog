import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import StudioModel from "../models/studio.model.js";
import { sendResponse, sendError } from "../../helperFunction/response.js";
import { handleUpload } from '../../helperFunction/uploadFile.js';

const uploadPath = 'studio/avatar';
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
                await handleUpload(req, uploadPath);
                const { name } = (req as any).body;

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

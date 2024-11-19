import { IncomingMessage, ServerResponse } from "http";
import CodeModel from "../models/codeAV.model.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { sendResponse, sendError } from "../../helperFunction/response.js";

export const createCodeAV = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                let body = '';
    
                req.on('data', chunk => {
                        body += chunk;
                });
    
                req.on('end', async () => {
                        try {
                                const parsedBody = JSON.parse(body);
                                const { codeName } = parsedBody;

                                if (!codeName) {
                                        return sendError(res, 400, new Error('codeName is required.'));
                                }

                                const existingCode = await CodeModel.findOne({ codeName });
                                if (existingCode) {
                                        return sendResponse(res, 409, { message: 'Code already exists.' });
                                }

                                const newCode = new CodeModel({ codeName });
                                await newCode.save();

                                sendResponse(res, 201, newCode);
                        } catch (error) {
                                console.error('Error parsing body or saving code:', error);
                                return sendError(res, 500, new Error('Invalid request body or error saving data.'));
                        }
                });
        } catch (error) {
            // Xử lý các lỗi khác
            console.error('Unexpected error:', error);
            return sendError(res, 500, error);
        }
};

export const getCodeAV = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const codes = await CodeModel.find();
                sendResponse(res, 200, codes);
        } catch (error) {
                console.error('Error retrieving codeAVs:', error);
                sendError(res, 500, new Error('Error retrieving codeAVs from the database.'));
        }
};

export const updateCodeAV = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                let body = '';

                req.on('data', chunk => {
                        body += chunk;
                });

                req.on('end', async () => {
                        try {
                                const parsedBody = JSON.parse(body);
                                const { codeName } = parsedBody;

                                if (!codeName) {
                                        return sendError(res, 400, new Error('codeName is required.'));
                                }

                                const urlParts = req.url?.split('/');
                                const codeId = urlParts?.[urlParts.length - 1];

                                if (!codeId) {
                                        return sendError(res, 400, new Error('Invalid codeAV ID.'));
                                }

                                const updatedCode = await CodeModel.findByIdAndUpdate(
                                        codeId,
                                        { codeName },
                                        {
                                                new: true, 
                                                runValidators: true 
                                        }
                                );

                                if (!updatedCode) {
                                        return sendError(res, 404, new Error('CodeAV not found.'));
                                }

                                sendResponse(res, 200, updatedCode);
                        } catch (error) {
                                console.error('Error parsing body or updating codeAV:', error);
                                return sendError(res, 500, new Error('Invalid request body or error updating data.'));
                        }
                });
        } catch (error) {
                console.error('Unexpected error:', error);
                return sendError(res, 500, error);
        }
};

export const deleteCodeAV = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const urlParts = req.url?.split('/');
                const codeId = urlParts?.[urlParts.length - 1];

                if (!codeId) {
                        return sendError(res, 400, new Error('Invalid codeAV ID.'));
                }

                const deletedCode = await CodeModel.findByIdAndDelete(codeId);

                if (!deletedCode) {
                        return sendError(res, 404, new Error('CodeAV not found.'));
                }

                sendResponse(res, 200, {
                        message: 'CodeAV deleted successfully.',
                        code: deletedCode
                });
        } catch (error) {
                console.error('Error deleting codeAV:', error);
                sendError(res, 500, new Error('Error deleting codeAV from the database.'));
        }
};
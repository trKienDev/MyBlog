import { IncomingMessage, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response";
import Code from "../models/code.model";
import Studio from "../models/studio.model";

export const createCode = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                let body = '';
    
                req.on('data', chunk => {
                        body += chunk;
                });
    
                req.on('end', async () => {
                        try {
                                const parsedBody = JSON.parse(body);
                                const { codeName, studio } = parsedBody;

                                if (!codeName || !studio) {
                                        return sendError(res, 400, new Error('code and studio are required.'));
                                }

                                const existingCode = await Code.findOne({ codeName, studio });
                                if (existingCode) {
                                        return sendResponse(res, 409, { message: 'Code already exists.' });
                                }

                                const newCode = new Code({ codeName, studio });
                                await newCode.save();

                                // Cập nhật Studio để thêm ID của code vào field `code`
                                const studioUpdateResult = await Studio.findByIdAndUpdate(
                                        studio,
                                        { $push: { code: newCode._id } }, // Thêm ID của code vào mảng `code`
                                        { new: true, runValidators: true }
                                );

                                if (!studioUpdateResult) {
                                        console.error('Studio not found for ID:', studio);
                                        return sendError(res, 404, new Error('Studio not found.'));
                                }

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
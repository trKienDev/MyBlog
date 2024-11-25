import { IncomingMessage, ServerResponse } from "http";
import FilmModel from "../models/film.model.js";
import mongoose from "mongoose";
import path from "path";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { sendResponse, sendError } from "../../helperFunction/response.js";
import { handleUpload } from '../../helperFunction/uploadFile.js';

const thumbnailUploadPath = 'thumbnail';

export const createFilm = async (req: CustomRequest, res: ServerResponse) => {
        
        try {
                await handleUpload(req, thumbnailUploadPath); 
                console.log("body: ", (req as any).body);

                const { actress, code, releaseDate, studio, tag } = (req as any).body;
                const tags = tag.split(',').map((id: string) => new mongoose.Types.ObjectId(id.trim()));

                // Tạo URL cho ảnh nếu đã tải lên thành công
                let thumbnailName = '';
                if((req as any).file) {
                        thumbnailName = (req as any).file.filename;
                }
               
                const newFilm = new FilmModel({ // Lỗi
                        code: code,
                        studio_id: new mongoose.Types.ObjectId(studio),
                        actress_id: new mongoose.Types.ObjectId(actress),
                        tag_id: tags,
                        release_date: releaseDate,
                        thumbnail: thumbnailName // Lưu URL của ảnh vào thuộc tính image
                });

                await newFilm.save();
                sendResponse(res, 201, newFilm);
        } catch (error) {
                const err = error as Error;
                console.error("Error creating film:", err.message);

                // Trả về phản hồi lỗi
                return sendError(res, 500, { message: "Failed to create film.", error: err.message });
        }
};

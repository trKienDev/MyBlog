import { IncomingMessage, ServerResponse } from "http";
import FilmModel from "../models/film.model.js";
import VideoModel from "../models/video.model.js";
import mongoose from "mongoose";
import path from "path";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { sendResponse, sendError } from "../../helperFunction/response.js";
import { handleUpload } from '../../helperFunction/uploadFile.js';

// const thumbnailUploadPath = 'thumbnail';
const thumbnailUploadPath = path.join(process.cwd(), "..", "..", "uploads", "thumbnail");
console.log(thumbnailUploadPath);

export const createFilm = async (req: CustomRequest, res: ServerResponse) => {``
        try {
                await handleUpload(req, thumbnailUploadPath); 

                const { actress, code, releaseDate, studio, tag, videos, story } = (req as any).body;
                const tags = tag.split(',').map((id: string) => new mongoose.Types.ObjectId(id.trim()));

                const existingFilm = await FilmModel.findOne({ code });
                console.log("code: ", code);
                console.log("studio: ", studio);

                if(existingFilm) {
                        return sendError(res, 409, { message: 'This film already exist!'});
                }

                // Tạo URL cho ảnh nếu đã tải lên thành công
                let thumbnailName = '';
                if((req as any).file) {
                        thumbnailName = (req as any).file.filename;
                }
               
                const newFilm = new FilmModel({ 
                        code: code,
                        studio_id: new mongoose.Types.ObjectId(studio),
                        actress_id: new mongoose.Types.ObjectId(actress),
                        story_id: new mongoose.Types.ObjectId(story),
                        tag_id: tags,
                        release_date: releaseDate,
                        video: videos.split(',').map((id: string) => new mongoose.Types.ObjectId(id.trim())),
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

export const getFilm = async (req: IncomingMessage, res: ServerResponse) => {
        try {
                const films = await FilmModel.find();
                sendResponse(res, 200, films);
        } catch(error) {
                sendError(res, 500, error);
        }
}
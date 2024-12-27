import { IncomingMessage, ServerResponse } from "http";
import FilmModel from "../models/film.model.js";
import VideoModel from "../models/video.model.js";
import mongoose from "mongoose";
import path from "path";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { sendResponse, sendError } from "../../middlewares/response.js";
import { handleUpload } from '../../middlewares/uploadFile.js';
import { isBuffer } from "util";

// const thumbnailUploadPath = 'thumbnail';
const thumbnailUploadPath = path.join(process.cwd(), "..", "..", "uploads", "thumbnail");

export const createFilm = async (req: CustomRequest, res: ServerResponse) => {``
        try {
                await handleUpload(req, thumbnailUploadPath); 

                const { name, actress, code, releaseDate, studio, tag, videos, story } = (req as any).body;
                const tags = tag.split(',').map((id: string) => new mongoose.Types.ObjectId(id.trim()));

                const existingFilm = await FilmModel.findOne({ name }); 

                if(existingFilm) {
                        return sendError(res, 409, { message: 'This film already exist!'});
                }

                // Tạo URL cho ảnh nếu đã tải lên thành công
                let thumbnailName = '';
                if((req as any).file) {
                        thumbnailName = (req as any).file.filename;
                }
               
                const newFilm = new FilmModel({ 
                        name: name,
                        code_id: new mongoose.Types.ObjectId(code),
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
                const films = await FilmModel.find().populate({ path: 'actress_id', select: 'image'})
                                                                        .populate({ path: 'studio_id', select: 'image'})
                                                                        .populate({ path: 'story_id', select: 'name'});
                sendResponse(res, 200, films);
        } catch(error) {
                sendError(res, 500, error);
        }
};

export const updateFilm = async (req: CustomRequest, res: ServerResponse) => {
        try {
                const urlPath = req.url?.split("/");
                const filmID = urlPath?.[urlPath.length - 1];

                const existingFilm = await FilmModel.findById(filmID);
                if(!existingFilm) {
                        return sendError(res, 404, new Error("Film is not found!"));
                }

                // Cập nhật thumbnail mới (nếu có)
                await handleUpload(req, thumbnailUploadPath);
                let updatedThumbnail = existingFilm.thumbnail;
                if((req as any).file) {
                        updatedThumbnail = (req as any).file.filename;
                }

                // Lấy dữ liệu từ body
                const { name, actress, code, releaseDate, studio, tag, videos, story } = (req as any).body; 

                // Xử lý danh sách tags và videos nếu có
                const tags = tag ? tag.split(",").map((id: string) => new mongoose.Types.ObjectId(id.trim())) : existingFilm.tag_id;
                const videoIds = videos ? videos.split(",").map((id: string) => new mongoose.Types.ObjectId(id.trim())) : existingFilm.video;

                // Cập nhật các trường của phim
                existingFilm.name = name || existingFilm.name;
                existingFilm.code_id = code ? new mongoose.Types.ObjectId(code) : existingFilm.code_id;
                existingFilm.studio_id = studio ? new mongoose.Types.ObjectId(studio) : existingFilm.studio_id;
                existingFilm.actress_id = actress ? new mongoose.Types.ObjectId(actress) : existingFilm.actress_id;
                existingFilm._id = story ? new mongoose.Types.ObjectId(story) : existingFilm.story_id;
                existingFilm.tag_id = tags;
                existingFilm.release_date = releaseDate || existingFilm.release_date;
                existingFilm.video = videoIds;
                existingFilm.thumbnail = updatedThumbnail;

                // Lưu vào cơ sở dữ liệu
                await existingFilm.save();

                // Trả về phản hồi thành công
                sendResponse(res, 201, existingFilm);
        } catch(error) {
                const err = error as Error;
                console.error("Error updating film:", err.message);
                // Trả về phản hồi lỗi
                sendError(res, 500, { message: "Failed to update film.", error: err.message });
        }
};
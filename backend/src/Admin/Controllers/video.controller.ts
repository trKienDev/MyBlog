import { IncomingMessage, ServerResponse } from "http";
import VideoModel from "../models/video.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { parse } from "querystring";
import { sendResponse, sendError } from "../../helperFunction/response.js";
import mongoose from "mongoose";



const videoUploadPath = path.join(process.cwd(), "..", "..", "videos");
console.log(videoUploadPath);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(videoUploadPath)) {
            fs.mkdirSync(videoUploadPath, { recursive: true });
        }
        cb(null, videoUploadPath);
    },
    filename: (req, file, cb) => {
        const customReq = req as CustomRequest;
        const body = customReq.body;

        // Lấy giá trị 'videoname' từ body
        const videoName = body.videoname || "default-video-name";
        const fileExtension = path.extname(file.originalname); // Lấy phần mở rộng file (vd: .mp4)

        // Tạo tên file từ 'videoname'
        const fileName = `${videoName}${fileExtension}`;
        file.filename = fileName; // Lưu tên file vào file object (multer)
        cb(null, fileName);
    },
});



const upload = multer({
        storage: storage,
        fileFilter: (req: IncomingMessage, file, cb) => {
                const customReq = req as CustomRequest; // Ép kiểu req thành CustomRequest

                if (file.mimetype !== "video/mp4") {
                        customReq.fileValidationError = "Only MP4 video files are allowed.";
                        return cb(null, false); // Từ chối file
                }

                cb(null, true); // Chấp nhận file hợp lệ
        },
}).fields([
        { name: 'video_0', maxCount: 1 },
        { name: 'video_1', maxCount: 1 },
        { name: 'video_2', maxCount: 1 },
        { name: 'video_3', maxCount: 1 },
        { name: 'video_4', maxCount: 1 },
        { name: 'video_5', maxCount: 1 },
        { name: 'video_6', maxCount: 1 },
        { name: 'video_7', maxCount: 1 },
        { name: 'video_8', maxCount: 1 },
        { name: 'video_9', maxCount: 1 },
]);

export const createVideo = async (req: IncomingMessage, res: ServerResponse) => {
        upload(req as any, res as any, async (err: any) => {
            const customReq = req as CustomRequest;
    
            // Kiểm tra lỗi validate file
            if (customReq.fileValidationError) {
                return sendResponse(res, 400, { message: "Only MP4 video files are allowed." });
            }
    
            // Kiểm tra lỗi upload
            if (err) {
                return sendError(res, 500, err);
            }
    
            const files = customReq.files;
            const body = customReq.body;
    
            // Kiểm tra xem file có được upload không
            if (!files || Object.keys(files).length === 0) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify({ message: "No files uploaded." }));
            }
    
            try {
                const videos = []; // Tạo danh sách video để lưu
    
                for (const fieldName in files) {
                    const fileArray = files[fieldName]; // Lấy danh sách file từ field name
                    
                    if (Array.isArray(fileArray)) {
                        for (const file of fileArray) {
                            const video = {
                                name: body.name, // Tên video
                                codeAV: new mongoose.Types.ObjectId(body.codeAV), // Chuyển codeAV thành ObjectId
                                actress: new mongoose.Types.ObjectId(body.actress), // Chuyển actress thành ObjectId
                                videotag: new mongoose.Types.ObjectId(body.videotag), // Chuyển videotag thành ObjectId
                                filePath: file.filename, // Đường dẫn file video
                            };
                            videos.push(video); // Thêm video vào danh sách
                        }
                    }
                }
    
                // Lưu tất cả video vào MongoDB
                await VideoModel.insertMany(videos);
    
                // Trả về phản hồi thành công
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify({ message: "Videos created successfully.", videos }));
            } catch (error) {
                // Xử lý lỗi trong quá trình lưu video
                const err = error as Error;
                console.error("Error saving videos:", err.message);
    
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                return res.end(
                    JSON.stringify({
                        message: "Failed to create videos.",
                        error: err.message,
                    })
                );
            }
        });
};
    
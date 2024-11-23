import { IncomingMessage, ServerResponse } from "http";
import VideoModel from "../models/video.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { parse } from "querystring";
import { sendResponse, sendError } from "../../helperFunction/response.js"


const videoUploadPath = path.join(process.cwd(), "src", "upload", "videos");

const storage = multer.diskStorage({
        destination: (req, file, cb) => {
                if (!fs.existsSync(videoUploadPath)) {
                        fs.mkdirSync(videoUploadPath, { recursive: true });
                }
                cb(null, videoUploadPath);
        },
        filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
                cb(null, uniqueSuffix);
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
                const customReq = req as CustomRequest; // Ép kiểu req về CustomRequest

                if (customReq.fileValidationError) {
                        return sendResponse(res, 400, { message: 'There are some errors.' });
                }

                if (err) { 
                        console.log(err);
                        sendError(res, 500, err);
                }
                const files = customReq.files;
                const body = customReq.body;
                console.log("body: ", body);
    
                if (!files || Object.keys(files).length === 0) {
                        res.statusCode = 400;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: "No files uploaded." }));
                        return;
                }
                

                try {
                        const videos = [];
                        for (const fieldName in files) { // Lặp qua từng field name
                                const fileArray = files[fieldName]; // Lấy mảng file từ field name
                                if (Array.isArray(fileArray)) {
                                        // Nếu là mảng, lặp qua từng phần tử
                                        for (const file of fileArray) {
                                            console.log("File in array:", file);
                                            const video = {
                                                name: body.name,
                                                codeAV: body.codeAV,
                                                actress: body["film-actress"],
                                                videotag: body.videotag,
                                                filePath: file.path,
                                            };
                                            videos.push(video);
                                        }
                                } else {
                                        // Nếu không phải mảng, xử lý trực tiếp đối tượng
                                        console.log("Single file object:", fileArray);
                                        const video = {
                                            name: body.name,
                                            codeAV: body.codeAV,
                                            actress: body["film-actress"],
                                            videotag: body.videotag,
                                            filePath: fileArray.path,
                                        };
                                        videos.push(video);
                                }
                        }
                        await VideoModel.insertMany(videos);

                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: "Videos created successfully.", videos}));
                } catch (error) {
                        const err = error as Error; // Ép kiểu error về Error
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(
                                JSON.stringify({
                                        message: "Failed to create videos.",
                                        error: err.message,      // Sử dụng err.message
                                })
                        );
                }
        });
};
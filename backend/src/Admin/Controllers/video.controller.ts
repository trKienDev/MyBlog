import { IncomingMessage, ServerResponse } from "http";
import VideoModel from "../models/video.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { parse } from "querystring";


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
}).array("file", 10); // Cho phép upload tối đa 10 file

export const createVideo = (req: IncomingMessage, res: ServerResponse) => {
        upload(req as any, res as any, (err: any) => {
                const customReq = req as CustomRequest; // Ép kiểu req về CustomRequest

                if (customReq.fileValidationError) {
                        res.statusCode = 400;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: customReq.fileValidationError }));
                        return;
                }

                if (err) { // lỗi ở đây
                        console.log(err);
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: "File upload failed.", error: err.message }));
                        return;
                }
                // Lỗi ở đây
                const files = customReq.files;
                const body = customReq.body;
    
                if (!files || files.length === 0) {
                        res.statusCode = 400;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: "No files uploaded." }));
                        return;
                }
                

                try {
                        const videos = [];
                        for (const file of files) {
                                const video = {
                                        name: body.name,
                                        codeAV: body.codeAV,
                                        actress: body["film-actress"],
                                        tag: body.tag,
                                        filePath: file.path,
                                };
                                videos.push(video);
                        }
        
                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ message: "Videos created successfully.", videos }));
                } catch (error) {
                        const err = error as Error; // Ép kiểu error về Error
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(
                                JSON.stringify({
                                        message: "Failed to create videos.",
                                        error: err.message, // Sử dụng err.message
                                })
                        );
                }
        });
};
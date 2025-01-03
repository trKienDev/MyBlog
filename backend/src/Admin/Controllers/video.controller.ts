import { IncomingMessage, ServerResponse } from "http";
import VideoModel from "../models/video.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { parse } from "querystring";
import { sendResponse, sendError } from "../../middlewares/response.js";
import mongoose from "mongoose";
import { handleUpload } from "../../middlewares/uploadFile.js";
import { url } from "inspector";

let index = 0;

const videoUploadPath = path.join(process.cwd(), "..", "..", "uploads", "videos");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(videoUploadPath)) {
            fs.mkdirSync(videoUploadPath, { recursive: true });
        }
        cb(null, videoUploadPath);
    },
    filename: (req, file, cb) => {
        index = index + 1;
        const customReq = req as CustomRequest;
        const body = customReq.body;

        // Lấy giá trị 'videoname' từ body
        const videoName = body.videoname + '_' + index || "default-video-name";
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
            const videoTags = Object.keys(body)
                                                    .filter((key) => key.startsWith("video_tag_"))
                                                    .map((key) => body[key]);

            const videos = []; // Tạo danh sách video để lưu
            let i = 0;       
            for (const fieldName in files) {
                const fileArray = files[fieldName]; // Lấy danh sách file từ field name
                if (Array.isArray(fileArray)) {
                    for (const file of fileArray) {
                        const videoName = `${body.videoname}_${i+1}`;
                        console.log("body: ", body);
                        const video = {
                            name: videoName, 
                            codeAV: body.codeAV,
                            actress: body.actress,
                            videotag: videoTags[i],
                            filePath: file.filename, 
                        };
                        videos.push(video); 
                        i = i + 1;
                    }
                }
            }

            // Lưu tất cả video vào MongoDB
            const savedVideos = await VideoModel.insertMany(videos);

            // Trả về phản hồi thành công
            return sendResponse(res, 201, savedVideos);
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
    
export const getVideoById = async (req: CustomRequest, res: ServerResponse) => {
    try {
        const urlPath = req.url?.split("/");
        const videoId = urlPath?.[urlPath.length - 1];

        if(!videoId) {
            return sendResponse(res, 400, { message: "Video Id is required"});
        }

        const video = await VideoModel.findById(videoId).exec();
        if(!video) {
            return sendResponse(res, 404, { message: "Video not found!"});
        }

        // Trả về thông tin video
        return sendResponse(res, 200, { video: video });
    } catch (error) {
        const err = error as Error;
        console.error("Error fetching video: ", err.message);
        return sendError(res, 500, err);
    }
};

export const updateVideo = async (req: CustomRequest, res: ServerResponse) => {
    try {
        upload(req as any, res as any, async (err: any) => {
            const customReq = req as CustomRequest;
            const files = customReq.files;
            const body = customReq.body;
        });
        // const urlPath = req.url?.split("/");
        // const videoId = urlPath?.[urlPath.length - 1];

        // const existingVideo = await VideoModel.findById(videoId);
        // if(!existingVideo) {
        //     return sendError(res, 404, new Error("Videos not found"))
        // } 

        // // Xử lý upload file mới nếu có
        // await handleUpload(req, videoUploadPath);
        // let updatedFilePath = existingVideo.filePath;
        // if((req as any).file) {
        //     updatedFilePath = (req as any).file.filename;

        //     // Xoá file cũ
        //     const oldFilePath = path.join(videoUploadPath, existingVideo.filePath);
        //     if(fs.existsSync(oldFilePath)) {
        //         fs.unlinkSync(oldFilePath);
        //     }
        // }

        // // Lấy dữ liệu từ body
        // const { name, actress, codeAV, videoTag } = (req as any).body;

        // // Cập nhật thông tin video
        // existingVideo.name = name || existingVideo;
        // existingVideo.actress = actress ? new mongoose.Types.ObjectId(actress) : existingVideo.actress;
        // existingVideo.codeAV = codeAV ? new mongoose.Types.ObjectId(codeAV) : existingVideo.codeAV;
        // existingVideo.videotag = videoTag ? videoTag.split(",").map((id: string) => new mongoose.Types.ObjectId(id.trim())) : existingVideo.videotag;
        // existingVideo.filePath = updatedFilePath;

        // // Lưu thay đổi vào cơ sở dữ liệu
        // await existingVideo.save();

        // // Trả về phản hồi thành công
        // sendResponse(res, 200, existingVideo);
    } catch(error) {
        const err = error as Error;
        console.error("Error updating video:", err.message);

        // Trả về phản hồi lỗi
        sendError(res, 500, { message: "Failed to update video.", error: err.message });
    }
};

export const deleteVideo = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        // Lấy videoId từ URL
        const urlParts = req.url?.split("/");
        const videoId = urlParts?.[urlParts.length - 1];

        if(!videoId) {
            return sendError(res, 400, { message:  "Video ID is required"});
        }

        const video = await VideoModel.findById(videoId);
        if(!video) {
            return sendError(res, 404, { message: "Video not found"});
        }

        // Xoá video trên máy
        const filePath = path.join(videoUploadPath, video.filePath);
        fs.unlink(filePath, (err) => {
            if(err) {
                console.error("Error deleting file: ", err);
            } else {
                console.log("File deleted successfully")
            }
        });

        await VideoModel.findByIdAndDelete(videoId);

        sendResponse(res, 200, { message: "Video deleted successfully."});
    } catch(error) {
        const err = error as Error;
        console.error("Error deleting video: ", err.message)
        return sendError(res, 500, { message: "Failed to delete video", error: err.message });
    }
};
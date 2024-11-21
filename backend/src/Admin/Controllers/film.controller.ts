import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { IncomingMessage, ServerResponse } from "http";
import FilmModel from "../models/film.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { sendResponse, sendError } from "../../helperFunction/response.js";

const uploadPath = 'film'; // Thư mục gốc cho phim, bao gồm thumbnail và videos

// Cấu hình multer để xử lý cả ảnh thumbnail và video
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "thumbnail") {
            cb(null, path.join(process.cwd(), "src", "upload", uploadPath, "thumbnail"));
        } else if (file.fieldname === "videos") {
            cb(null, path.join(process.cwd(), "src", "upload", uploadPath, "videos"));
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (file.fieldname === "thumbnail") {
            if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
                return cb(new Error("Only .jpg, .jpeg, .png files are allowed for thumbnail"));
            }
        } else if (file.fieldname === "videos") {
            if (ext !== ".mp4") {
                return cb(new Error("Only .mp4 files are allowed for videos"));
            }
        }
        cb(null, true);
    },
});

export const createFilm = async (req: CustomRequest, res: ServerResponse) => {
    // Dùng multer để upload thumbnail và video
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "videos", maxCount: 20 }
    ])(req as any, {} as any, async (err: any) => {
        if (err) {
            return sendError(res, 400, err);
        }

        try {
            const { code, studio_id, actress_id, tag_id, release_date, story, rating } = req.body;

            // Kiểm tra sự tồn tại của thumbnail và videos
            let thumbnail = "";
            let videos: string[] = [];

            if (req.files && req.files["thumbnail"]) {
                thumbnail = req.files["thumbnail"][0].filename;
            }

            if (req.files && req.files["videos"]) {
                videos = req.files["videos"].map((file) => file.filename);
            }

            // Tạo đối tượng Film mới
            const newFilm = new FilmModel({
                code,
                studio_id,
                actress_id,
                tag_id,
                release_date,
                story,
                video: videos,  // lưu danh sách video
                thumbnail,  // lưu tên thumbnail
                rating,
            });

            await newFilm.save();

            sendResponse(res, 201, newFilm);
        } catch (error) {
            console.error("Error in createFilm:", error);
            sendError(res, 500, error);
        }
    });
};

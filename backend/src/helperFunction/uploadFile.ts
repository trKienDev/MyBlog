import { CustomRequest } from "../interfaces/CustomRequest.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "src", "upload", "actress", "avatar");

// Tạo thư mục upload nếu chưa tồn tại
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

export const handleUpload = (req: CustomRequest) => {
    return new Promise<void>((resolve, reject) => {
        const uploadSingleFile = upload.single("image");

        // Xử lý file upload
        uploadSingleFile(req as any, {} as any, (err: any) => {
            if (err) {
                reject(err);
            } else if (req.file) {
                // Ép kiểu req.file để TypeScript nhận biết chắc chắn nó tồn tại
                const file = req.file as { filename: string; path: string };
                const oldPath = path.join(uploadPath, file.filename);
                const newFileName = `profile_${req.body.name.replace(/\s+/g, "")}${path.extname(file.filename)}`;
                const newPath = path.join(uploadPath, newFileName);
                
                fs.rename(oldPath, newPath, (renameErr) => {
                    if (renameErr) {
                        reject(renameErr);
                    } else {
                        file.filename = newFileName; // Cập nhật lại tên file
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    });
};
    

import { CustomRequest } from "../interfaces/CustomRequest.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Các định dạng file được cho phép
let allowedFileTypes: string[] = [ ".jpg" , ".jpeg" , ".png" , ".gif", ".mp4" ];

const getUploadPath = (folder: string) => {
        return path.join(process.cwd(), "src", "upload", folder);
};

// Tạo thư mục upload nếu chưa tồn tại
const ensureUploadPathExists = (uploadPath: string) => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
};

// Cấu hình multer 
const createMulterStorage = (uploadPath: string) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
};

export const handleUpload = (req: CustomRequest, folder: string) => {
    return new Promise<void>((resolve, reject) => {
        const uploadPath = getUploadPath(folder);
        ensureUploadPathExists(uploadPath); // Tạo thư mục nếu chưa tồn tại
        const storage = createMulterStorage(uploadPath);

        const upload = multer({
            storage,
            fileFilter: (req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();
                if (!allowedFileTypes.includes(ext)) {
                    return cb(new Error(`Only the following file types are allowed: ${allowedFileTypes.join(", ")}`));
                }
                cb(null, true);
            },
        });
        
        const uploadSingleFile = upload.single("file"); // nhận trường tên "file" trong formData

        // Xử lý file upload
        uploadSingleFile(req as any, {} as any, (err: any) => {
            if (err) {
                reject(err);
            } else if (req.file) {
                // Ép kiểu req.file để TypeScript nhận biết chắc chắn nó tồn tại
                const file = req.file as { filename: string; path: string };
                const oldPath = path.join(uploadPath, file.filename);
                const timestamp = Date.now(); 
                const newFileName = `${req.body.name.replace(/\s+/g, "")}_${timestamp}${path.extname(file.filename)}`;
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
    

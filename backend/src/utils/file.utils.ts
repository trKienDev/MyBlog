import multer, { Multer } from "multer";
import { CustomRequest } from "../interfaces/CustomRequest";
import path from "path";
import fs from "fs";
import { ExtractIdFromRequest, ExtractNameFromRequest } from "./request.utils.js";

const allowedFileTypes: string[] = [".jpg", ".jpeg", ".png", ".gif", ".mp4"];

const getUploadPath = (folder: string) => {
      return path.join(process.cwd(), "..", "..", "uploads", folder);
};

const ensureUploadPathExists = (uploadPath: string) => {
      if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
      }
};

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

// Hàm tạo fileFilter riêng (tuỳ chọn)
const FileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedFileTypes.includes(ext)) {
            return cb(new Error(`Only allowed file types: ${allowedFileTypes.join(", ")}`));
      }
      cb(null, true);
};

// Hàm xử lý upload bằng Multer, bọc thành Promise
const handleMulterUpload = (req: CustomRequest, upload: Multer): Promise<void> => {
      return new Promise((resolve, reject) => {
            upload.single("file")(req as any, {} as any, (err: any) => {
                  if (err) {
                        return reject(err);
                  }
                  resolve();
            });
      });
};

// Hàm đổi tên file
const renameUploadedFile = (uploadPath: string, originalFileName: string, name: string): Promise<string> => {
      return new Promise((resolve, reject) => {
            const timestamp = Date.now();
            const newFileName = `${name.replace(/\s+/g, "")}_${timestamp}${path.extname(originalFileName)}`;
            const oldPath = path.join(uploadPath, originalFileName);
            const newPath = path.join(uploadPath, newFileName);
            fs.rename(oldPath, newPath, (err) => {
                  if (err) {
                        return reject(err);
                  }
                  resolve(newFileName);
            });
      });
};

/**
 * Hàm UploadFile xử lý việc nhận file upload, đổi tên file và trả về thông tin.
 */
export const uploadFile = async (req: CustomRequest, folder: string): Promise<{ id: string, name: string, file_name: string }> => {
      try {
            const uploadPath = getUploadPath(folder);
            ensureUploadPathExists(uploadPath);

            const storage = createMulterStorage(uploadPath);
            const upload = multer({ 
                  storage, 
                  fileFilter: FileFilter 
            });
            
            // Xử lý upload file
            await handleMulterUpload(req, upload);

            // Lấy thông tin từ req.body
            const id = ExtractIdFromRequest(req);
            const name = ExtractNameFromRequest(req);
            
            let file_name = "";
            if ((req as any).file) {
                  // Nếu có file, đổi tên file
                  const file = (req as any).file as { filename: string };
                  file_name = await renameUploadedFile(uploadPath, file.filename, name);
            }
            
            return { id, name, file_name };
      } catch(error) {
            console.error("Error in UploadFile - file.utils.ts: ", error);
            throw error;
      }
};
import { CustomRequest } from "../interfaces/CustomRequest.js";
import multer from "multer";
import path from "path";
import fs from "fs";

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

/**
 * Hàm uploadFile xử lý việc nhận file upload và đổi tên file.
 * Nó trả về một Promise chứa đối tượng { name, imgName }.
 */
export const uploadFile = (req: CustomRequest, folder: string): Promise<{ name: string; imgName: string }> => {
      return new Promise((resolve, reject) => {
            const uploadPath = getUploadPath(folder);
            ensureUploadPathExists(uploadPath);
            const storage = createMulterStorage(uploadPath);

            const upload = multer({
                  storage,
                  fileFilter: (req, file, cb) => {
                        const ext = path.extname(file.originalname).toLowerCase();
                        if (!allowedFileTypes.includes(ext)) {
                              return cb(new Error(`Only allowed file types: ${allowedFileTypes.join(", ")}`));
                        }
                        cb(null, true);
                  },
            });

            // Sử dụng upload.single để xử lý file upload với field name "file"
            upload.single("file")(req as any, {} as any, (err: any) => {
                  if (err) {
                        return reject(err);
                  }

                  // Lấy tên từ body của request
                  const name = (req as any).body.name || "";

                  if ((req as any).file) {
                        const file = (req as any).file as { filename: string; path: string };
                        const oldPath = path.join(uploadPath, file.filename);
                        const timestamp = Date.now();
                        // Đổi tên file dựa trên name và timestamp
                        const newFileName = `${name.replace(/\s+/g, "")}_${timestamp}${path.extname(file.filename)}`;
                        const newPath = path.join(uploadPath, newFileName);

                        fs.rename(oldPath, newPath, (renameErr) => {
                        if (renameErr) {
                              return reject(renameErr);
                        }
                        file.filename = newFileName;
                              return resolve({ name, imgName: file.filename });
                        });
                  } else {
                        // Nếu không có file upload, trả về imgName rỗng
                        return resolve({ name, imgName: "" });
                  }
            });
      });
};

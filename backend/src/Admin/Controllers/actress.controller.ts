import { IncomingMessage, ServerResponse } from "http";
import ActressModel from "../models/actress.model.js";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Đường dẫn tới thư mục 'src/upload'
const uploadPath = path.join(process.cwd(), 'src', 'upload', 'actress', 'avatar');
// Đảm bảo thư mục 'upload' tồn tại
if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath); // Tạo thư mục nếu chưa tồn tại
}

// cấu hình multer
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
                console.log(uploadPath);
                cb(null, uploadPath); // Lưu file vào thư mục upload
        },
        filename: function (req, file, cb) {
                // cb(null, `${Date.now()}-${file.originalname}`);
                cb(null, `${Date.now()}-${file.originalname}`);
        }
});

const upload = multer({ storage: storage });

// Xử lý file upload với multer
const uploadSingleFile = upload.single('image');

// create 
export const createActress = async (req: IncomingMessage, res: ServerResponse) => {
        // Chạy multer với một promise để xử lý tải ảnh
        const handleUpload = () => {
                return new Promise<void>((resolve, reject) => {
                        uploadSingleFile(req as any, {} as any, (err: any) => {
                                if (err) {
                                        console.error('Multer upload error: ', err);
                                        reject(err);
                                } else {
                                        // Đổi tên file sau khi tải lên
                                        if((req as any).file) {
                                                const oldPath = path.join(uploadPath, (req as any).file.filename);
                                                const newFileName = `profile_${(req as any).body.name.replace(/\s+/g, '')}${path.extname((req as any).file.filename)}`;
                                                const newPath = path.join(uploadPath, newFileName);
                                                fs.rename(oldPath, newPath, (renameErr) => {
                                                        if (renameErr) {
                                                            console.error('Error renaming file:', renameErr);
                                                            reject(renameErr);
                                                        } else {
                                                            (req as any).file.filename = newFileName; // Cập nhật lại tên file
                                                            resolve();
                                                        }
                                                });
                                        } else {
                                                resolve();
                                        }
                                }
                        });
                });
        };

        try {
                // Xử lý upload file và các dữ liệu khác cùng lúc
                await handleUpload();

                // Lấy dữ liệu từ request sau khi multer xử lý
                const { name, birth, skin, studio, body, breast } = (req as any).body;

                // Tạo URL cho ảnh nếu đã tải lên thành công
                let imageName = '';
                if((req as any).file) {
                        imageName = (req as any).file.filename;
                }

                // Tạo đối tượng nữ diễn viên mới
                const newActress = new ActressModel({
                        name,
                        birth,
                        skin,
                        studio,
                        body,
                        breast,
                        image: imageName // Lưu URL của ảnh vào thuộc tính image
                });
                await newActress.save();

                // Trả về thông tin nữ diễn viên vừa tạo
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(newActress));
        } catch (error) {
                // Xử lý lỗi, trả về thông báo lỗi cụ thể
                res.statusCode = 500; // Sửa thành 500 để biểu thị lỗi server
                res.setHeader('Content-Type', 'application/json');
                if (error instanceof Error) {  // Nếu 'error' là một instance của Error
                        res.end(JSON.stringify({ message: 'Error creating actress in backend', error: error.message }));
                } else { // Nếu 'error' không phải là một instance của Error
                        res.end(JSON.stringify({ message: 'Unknown error occurred while creating actress' }));
                }
        }
};
    
// read
export const getActress = async ( req: IncomingMessage , res: ServerResponse ) => {
        try {
                // Truy vấn tất cả các actress từ CSDL
                const actress = await ActressModel.find();
                res.statusCode = 200;
                res.setHeader ( 'Content-Type' , 'application/json' );
                res.end ( JSON.stringify( actress ));
        }
        catch ( error ) {
                res.statusCode = 500;
                res.setHeader ( 'Content-Type' , 'application/json' );
                res.end ( JSON.stringify( { message : 'Error fetching actresses.' , error } ));
        } 
}

// update
export const updateActress = async ( req: IncomingMessage , res: ServerResponse ) => {
        const urlPath = req.url?.split('/');
        const actressID = urlPath?.[ urlPath.length - 1 ]; // Lấy ID từ URL
        
        if ( !actressID ) {
                res.statusCode = 400;
                res.setHeader ( 'Content-Type' , 'application/json' );
                return res.end ( JSON.stringify ({ message : 'Unable to get actress ID !' }));
        }
        
        let bodyJSON = '';
        req.on ( 'data' , chunk => {
                bodyJSON += chunk.toString();
        });
        req.on ( 'end' , async () => {
                try {
                        const updateData = JSON.parse ( bodyJSON );
                        const updatedActress = await ActressModel.findByIdAndUpdate( actressID , updateData , { new : true, runValidators : true });

                        if ( !updateActress ) {
                                res.statusCode = 404;
                                res.setHeader ( 'Content-Type' , 'application/json' );
                                return res.end(JSON.stringify({ message: 'Actress not found.' }));
                        }

                        res.statusCode = 200;
                        res.setHeader ( 'Content-Type' , 'application/json' );
                        return res.end(JSON.stringify( updatedActress));
                } 
                catch ( error ) {
                        res.statusCode = 500;
                        res.setHeader ( 'Content-Type' , 'application/json' );
                        return res.end ( JSON.stringify( { message : 'Error updating actress.', error }) );
                }
        } )
}

// delete
export const deleteActress = async ( req: IncomingMessage , res: ServerResponse ) => {
        // get ID actress from URL 
        const urlPath = req.url?.split('/');
        const actressID = urlPath?.[urlPath.length - 1];

        if ( !actressID ) {
                res.statusCode = 400;
                res.setHeader ( 'Content-Type' , 'application/json' );
                return res.end ( JSON.stringify ({ message : 'unable to get ID of actress' }));
        }

        try {
                // Find and delete 
                const actressDel = await ActressModel.findByIdAndDelete(actressID);
                
                if ( !actressDel ) {
                        res.statusCode = 404; 
                        res.setHeader ( 'Content-Type' , 'application/json' );
                        return res.end ( JSON.stringify ({ message : 'actress not found !' }));
                }

                res.statusCode = 200;
                res.setHeader ( 'Content-Type' , 'application/json' );
                return res.end ( JSON.stringify ({ message : 'actress deleted successfully. ' , actress: actressDel }));
        } 
        catch (error) {
                res.statusCode = 500;
                res.setHeader ( 'Content-Type' , 'application/json' );
                return res.end ( JSON.stringify ({ message : 'Error deleting actress' , error }));
        }
}


// import { IncomingMessage, ServerResponse } from "http";
// import CreatorModel from "../models/creator.model.js";
// import multer from "multer";
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import { handleUpload } from "../middlewares/uploadFile.js";
// import { CustomRequest } from "../interfaces/CustomRequest.js";
// import { sendResponse, sendError } from "../middlewares/response.js"
// import { send } from "process";

// const creatorUploadPath = path.join(process.cwd(), "..", "..", "uploads","creators", "avatar");

// export const createCreator = async (req: CustomRequest, res: ServerResponse) => {
//       try {
//             await handleUpload(req, creatorUploadPath); 

//             const { name, birth, skin, studio, body, breast } = (req as any).body; 
            
//             const existingCreator = await CreatorModel.findOne({ name, birth });
//             if (existingCreator) {
//                   return sendResponse(res, 409, { message: 'Creator already exists.' });
//             }
            
//             let imageName = '';
//             if((req as any).file) {
//                   imageName = (req as any).file.filename;
//             }

//             const newCreator = new CreatorModel({
//                   name,
//                   birth,
//                   skin,
//                   studio,
//                   body,
//                   breast,
//                   image: imageName
//             });
            
//             await newCreator.save();
//             sendResponse(res, 201, newCreator);
//       } catch (error) {
//             console.error('Error in createCreator:', error);
//             sendError(res, 500, error);
//       }
// };

// // export const getAllActresses = async ( req: IncomingMessage , res: ServerResponse ) => {
// //         try {
// //                 const actresses = await ActressModel.find().populate('name');
// //                 sendResponse(res, 200, actresses);
// //         }
// //         catch ( error ) {
// //                 console.error("error in getAllActresses - actress.controller.ts: ", error);
// //                 sendError(res, 500, error);
// //         } 
// // };

// // export const getActressById = async (req: CustomRequest, res: ServerResponse) => {
// //         try {
// //                 const urlPath = req.url?.split("/");
// //                 const actressID = urlPath?.[urlPath.length - 1]; // Lấy ID từ URL

// //                 if(!actressID) {
// //                         return sendError(res, 404, new Error("Invalid actress Id."));
// //                 }

// //                 const actress = await ActressModel.findById(actressID);
            
// //                 if(!actress) {
// //                         return sendError(res, 404, new Error("Actress not found !"));
// //                 }

// //                 sendResponse(res, 200, actress);
// //         } catch (error) {
// //                 console.error("Error in backend - getActressById: ", error);
// //         }
// // }


// // export const updateActress = async (req: CustomRequest, res: ServerResponse) => {
// //         const urlPath = req.url?.split("/");
// //         const actressID = urlPath?.[urlPath.length - 1]; // Lấy ID từ URL

// //         // Tìm thông tin nữ diễn viên cũ từ CSDL để lấy ảnh cũ
// //         const oldActress = await ActressModel.findById(actressID);
// //         if (!oldActress) {
// //                 return sendError(res, 404, new Error("Actress not found."));
// //         }

// //         try {   
// //                 await handleUpload(req, actressUploadPath); // Thực thi upload ảnh nếu có
// //                 const { name, birth, skin, studio, body, breast } = (req as any).body; // Lấy dữ liệu từ request

// //                 // Cập nhật URL ảnh nếu có ảnh mới
// //                 let newImageName = "";
// //                 if ((req as any).file) {
// //                         newImageName = (req as any).file.filename;
// //                 }

// //                 // Nếu có ảnh mới được tải lên, cần xử lý ảnh cũ
// //                 if (newImageName && oldActress.image) {
// //                         const oldImagePath = path.join(process.cwd(),
// //                                 "src",
// //                                 "upload",
// //                                 "actress",
// //                                 "avatar",
// //                                 oldActress.image
// //                         );
      
// //                         // Kiểm tra nếu ảnh cũ tồn tại, xóa nó
// //                         if (fs.existsSync(oldImagePath)) {
// //                                 fs.unlinkSync(oldImagePath);
// //                         }
// //                 }

// //                 // Chuẩn bị dữ liệu để cập nhật
// //                 const updateData: Record<string, any> = {
// //                         name,
// //                         birth,
// //                         skin,
// //                         studio,
// //                         body,
// //                         breast,
// //                 };

// //                 // Chỉ thêm trường `image` nếu ảnh mới được tải lên
// //                 if (newImageName) {
// //                         updateData.image = newImageName;
// //                 }

// //                 // Cập nhật database
// //                 const updatedActress = await ActressModel.findByIdAndUpdate(actressID, updateData, {
// //                         new: true,
// //                         runValidators: true,
// //                 });

// //                 if (!updatedActress) {
// //                         return sendError(res, 404, new Error('Actress not found.'));
// //                 }

// //                 // Trả về phản hồi thành công
// //                 sendResponse(res, 200, updatedActress);
// //         } catch (error) {
// //                 console.error("Error updating actress:", error);
// //                 sendError(res, 500, error);
// //         }
// // };

// // export const deleteActress = async ( req: IncomingMessage , res: ServerResponse ) => {
// //         // get ID actress from URL 
// //         const urlPath = req.url?.split('/');
// //         const actressID = urlPath?.[urlPath.length - 1];

// //         if ( !actressID ) {
// //                 return sendError(res, 400, new Error('Unable to get ID of actress'));
// //         }

// //         try {
// //                 // Find and delete 
// //                 const actressDel = await ActressModel.findByIdAndDelete(actressID);
            
// //                 if ( !actressDel ) {
// //                         return sendError(res, 404, new Error('Actress not found!'));
// //                 }

// //                 const imagePath = path.join(process.cwd(), "src", "upload", "actress", "avatar", actressDel.image);
// //                 if (fs.existsSync(imagePath)) {
// //                         fs.unlinkSync(imagePath); // Delete the image
// //                 }

// //                 return sendResponse(res, 200, {
// //                         message: 'Actress deleted successfully.',
// //                         actress: actressDel,
// //                 });
// //         } 
// //         catch (error) {
// //                 return sendError(res, 500, error);
// //         }
// // }


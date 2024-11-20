import { ServerResponse } from "http";
import VideoModel from "../models/video.model.js";
import ActressModel from "../models/actress.model.js";
import TagModel from "../models/tag.model.js";
import CodeAVModel from "../models/codeAV.model.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { sendResponse, sendError } from "../../helperFunction/response.js";
import { handleUpload } from "../../helperFunction/uploadFile.js";

const uploadPath = "videos";

export const createVideo = async (req: CustomRequest, res: ServerResponse) => {
        try {
                await handleUpload(req, uploadPath);
                const { name, code, actress, codeAV, tags } = (req as any).body;

                const actressExists = await ActressModel.findById(actress);
                if (!actressExists) {
                        return sendResponse(res, 404, { message: "Actress not found." });
                }

                const tagsExist = await TagModel.find({ _id: { $in: tags } });
                if (tagsExist.length !== tags.length) {
                        return sendResponse(res, 404, { message: "One or more tags not found." });
                }

                const codeAVExists = await CodeAVModel.findById(codeAV);
                if (!codeAVExists) {
                        return sendResponse(res, 404, { message: "CodeAV not found." });
                }

                let filePath = "";
                if ((req as any).file) {
                        filePath = (req as any).file.filename;
                }
                if (!filePath) {
                        return sendResponse(res, 400, { message: "Video file is required." });
                }

                const newVideo = new VideoModel({
                        name,
                        actress,
                        tags,
                        codeAV,
                        filePath,
                });
                await newVideo.save();

                sendResponse(res, 201, newVideo);
        } catch (error) {
                console.error("Error in createVideo:", error);
                sendError(res, 500, error);
        }
}
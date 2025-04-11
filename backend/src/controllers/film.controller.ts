import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { UploadFile } from "../utils/file.utils.js";
import { parseJSON } from "../middlewares/json-parser.js";
import { ExtractParamFromRequest } from "../utils/request.utils.js";
import Film from "../models/film.model.js";
import mongoose from "mongoose";

export const CreateFilm = async(req: CustomRequest, res: ServerResponse) => {
      try {
            console.log("run CreateFilm");
            const { name, imgName } = await UploadFile(req, "film");
            const thumbnail = imgName;
            const studio = ExtractParamFromRequest(req, "studio_id");
            const code = ExtractParamFromRequest(req, "code_id");
            const tagsParam = ExtractParamFromRequest(req, "tag_ids");
            const collection = ExtractParamFromRequest(req, "collection_id");
            const date = ExtractParamFromRequest(req, "date");
            const rating = ExtractParamFromRequest(req, "rating");
            
            const tagIds: string[] = tagsParam.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            const tagObjectIds = tagIds.map((id: string) => {
                  if(!mongoose.Types.ObjectId.isValid(id)) {
                        throw new Error(`Invalid tag ObjectId: ${id}`);
                  }
                  return new mongoose.Types.ObjectId(id);
            });

            const newFilm = new Film({
                  name: name,
                  code_id: new mongoose.Types.ObjectId(code),
                  studio_id: new mongoose.Types.ObjectId(studio),
                  tag_ids: tagObjectIds,
                  collection_id: new mongoose.Types.ObjectId(collection),
                  date: date,
                  rating: rating? Number(rating): 0,
                  thumbnail: thumbnail,
            });
            
            await newFilm.save();
            sendResponse(res, 201, newFilm);
      } catch(error) {
            const err = error as Error;
            console.error("Error creating film: ", err.message);
            return sendError(res, 500, { message: "Failed to create film.", error: err.message });
      }
}
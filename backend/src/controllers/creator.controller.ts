import path from "path";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { UploadFile } from "../utils/file.utils.js";
import Creator from "../models/creator.model.js";
import { CreatorRepository } from "../repository/creator.repository.js";
import { CreatorService } from "../services/creator.service.js";

const repository = new CreatorRepository();
const service = new CreatorService(repository);

export const CreateCreator = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const { imgName } = await UploadFile(req, "creator/avatar");
            const { name, birth, skin, studio, body, breast } = req.body;

            const result = await service.CreateCreator({
                  name, birth, skin, studio, body, breast, image: imgName
            });

            if(!result.success) {
                  return sendResponse(res, result.code, { message: result.message });
            }

            return sendResponse(res, result.code, result.data);
      } catch(error) { 
            console.error('Error in CreateCreator: ', error);
            sendError(res, 500, error);
      }
}
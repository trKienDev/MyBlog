import path from 'path';
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { StudioRepository } from '../repository/studio.repository.js';
import { StudioService } from '../services/studio.service.js';
import { uploadFile } from '../middlewares/uploadFile.js';

const studioRepository = new StudioRepository();
const studioService = new StudioService(studioRepository);

export const GetStudios = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const studios = await studioService.GetAllStudios();
            sendResponse(res, 200, studios);
      } catch(error) {
            console.error("Error retrieving studios: ", error);
            sendError(res, 500, new Error("Error retrieving studios from the database."));
      }
}

export const CreateStudio = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const { name, imgName } = await uploadFile(req, "studio");
            const newStudio = await studioService.CreateStudio(name, imgName);

            sendResponse(res, 201, newStudio);
      } catch(error) {
            console.error('Unexpected error: ', error);
            return sendError(res, 500, error);
      }
}



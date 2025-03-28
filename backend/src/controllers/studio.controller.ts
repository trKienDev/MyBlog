import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { StudioRepository } from '../repository/studio.repository.js';
import { StudioService } from '../services/studio.service.js';
import { UploadFile } from '../utils/file.utils.js';
import { ExtractIdFromRequest } from "../utils/request.utils.js";

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
            const { name, imgName } = await UploadFile(req, "studio");
            const newStudio = await studioService.CreateStudio(name, imgName);

            sendResponse(res, 201, newStudio);
      } catch(error) {
            console.error('Unexpected error: ', error);
            return sendError(res, 500, error);
      }
}

export const UpdateStudio = async (req: CustomRequest, res: ServerResponse) => {
      try { 
            const { id, name, imgName } = await UploadFile(req, "studio");
            await studioService.FindStudioById(id);
            const updateStudio = await studioService.UpdateStudio(id, {name, image: imgName});
            sendResponse(res, 200, updateStudio);
      } catch(error) {
            console.error('Error updating studio:', error);
            sendError(res, 500, new Error('Error updating studio.'));
      }
};

export const DeleteStudio = async(req: CustomRequest, res: ServerResponse) => {
      try {
            
      } catch(error) {
            console.error('Error deleting studio:', error);
            sendError(res, 500, new Error('Error updating studio.'));
      }
}
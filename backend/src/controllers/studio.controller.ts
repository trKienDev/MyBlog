import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { StudioRepository } from '../repository/studio.repository.js';
import { StudioService } from '../services/studio.service.js';
import { UploadFile } from '../utils/file.utils.js';

const repository = new StudioRepository();
const service = new StudioService(repository);

export const GetStudios = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const studios = await service.GetAllStudios();
            return  sendResponse(res, 200, studios);
      } catch(error) {
            console.error("Error retrieving studios: ", error);
            return sendError(res, 500, new Error("Error retrieving studios from the database."));
      }
}

export const CreateStudio = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const { name, imgName } = await UploadFile(req, "studio");
            const newStudio = await service.CreateStudio(name, imgName);

            return sendResponse(res, 201, newStudio);
      } catch(error) {
            console.error('Unexpected error: ', error);
            return sendError(res, 500, error);
      }
}

export const UpdateStudio = async (req: CustomRequest, res: ServerResponse) => {
      try { 
            const { name, imgName } = await UploadFile(req, "studio");

            const id = req.params?.id;
            if(!id) {
                  console.error("Cannot find id");
                  return sendError(res, 500, new Error('Cannot found id.'));
            } 
            await service.FindStudioById(id);
            
            const updateStudio = await service.UpdateStudio(id, {name, image: imgName});
            return sendResponse(res, 200, updateStudio);
      } catch(error) {
            console.error('Error updating studio:', error);
            return sendError(res, 500, new Error('Error updating studio.'));
      }
};

export const DeleteStudio = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            if(!id) {
                  console.error('Cannot find id');
                  return sendError(res, 500, new Error('Cannot found id.'));
            } 
            await service.DeleteStudio(id);
            return sendResponse(res, 200, { message: 'Studio deleted successfully'});
      } catch(error) {
            console.error('Error deleting studio in controller:', error);
            return sendError(res, 500, new Error('Error deleting studio.'));
      }
}
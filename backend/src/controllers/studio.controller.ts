import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { StudioRepository } from '../repository/studio.repository.js';
import { StudioService } from '../services/studio.service.js';
import { ValidateIdRequest } from "../interfaces/ValidatedIdRequest.js";

const repository = new StudioRepository();
const service = new StudioService(repository);

export const GetStudios = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const studios = await repository.FindStudios();
            return  sendResponse(res, 200, studios);
      } catch(error) {
            console.error("Error retrieving studios: ", error);
            return sendError(res, 500, new Error("Error retrieving studios from the database."));
      }
}

export const CreateStudio = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const createdStudio = await service.CreateStudio(req);

            return sendResponse(res, 201, createdStudio);
      } catch(error) {
            console.error('Unexpected error: ', error);
            return sendError(res, 500, error);
      }
}

export const UpdateStudio = async (req: ValidateIdRequest, res: ServerResponse) => {
      try { 
            const id = req.params?.id;
            
            const updateStudio = await service.UpdateStudio(req, id);
            return sendResponse(res, 200, updateStudio);
      } catch(error) {
            console.error('Error updating studio:', error);
            return sendError(res, 500, new Error('Error updating studio.'));
      }
};

export const DeleteStudio = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;

            await service.DeleteStudio(id);
            return sendResponse(res, 200, { message: 'Studio deleted'});
      } catch(error) {
            console.error('Error deleting studio in controller:', error);
            return sendError(res, 500, new Error('Error deleting studio.'));
      }
}
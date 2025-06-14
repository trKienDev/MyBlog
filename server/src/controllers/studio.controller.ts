import { CustomRequest } from "../interfaces/CustomRequest.js";
import { IncomingMessage, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { StudioRepository } from '../repository/studio.repository.js';
import { StudioService } from '../services/studio.service.js';
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new StudioRepository();
const service = new StudioService(repository);

export const getStudioById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const studio = await repository.findStudioById(id);
            return sendResponse(res, 200, studio);
      } catch(error) {
            console.error("Error retrieving studio by id: ", error);
            return sendError(res, 500, new Error("Error retrieving studio from repository"));
      }
}

const GetStudios = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const studios = await repository.findStudios();
            return  sendResponse(res, 200, studios);
      } catch(error) {
            console.error("Error retrieving studios: ", error);
            return sendError(res, 500, new Error("Error retrieving studios from the database."));
      }
}

const CreateStudio = async (request: IncomingMessage, response: ServerResponse) => {
      try {
            const createdStudio = await service.CreateStudio(request);
            return sendResponse(response, 201, createdStudio);
      } catch(error) {
            console.error('Unexpected error: ', error);
            return sendError(response, 500, error);
      }
}

export const UpdateStudio = async (req: ValidateIdRequest, res: ServerResponse) => {
      try { 
            const id = req.params?.id;
            
            const updateStudio = await service.updateStudio(req, id);
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

const studio_controller = {
      GetStudios,
      getStudioById,
      CreateStudio,
}
export default studio_controller;
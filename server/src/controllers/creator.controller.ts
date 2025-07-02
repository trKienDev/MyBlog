import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { CreatorService } from "../services/creator.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { CreatorRepository } from "../repositories/creator.repository.js";

const _creatorRepository = new CreatorRepository();
const _creatorService = new CreatorService(_creatorRepository);

const getCreatorById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const creator = await _creatorRepository.findById(id);
            if(creator == null) {
                  return sendError(res, 404, 'creator not found');
            }
            return sendResponse(res, 200, creator);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const GetCreators = async ( req: CustomRequest , res: ServerResponse ) => {
      try {
            const creators = await _creatorRepository.GetCreators();
            if(creators == null) {
                  return sendError(res, 500, 'Failed to get creators');
            }
            return sendResponse(res, 200, creators);
      }
      catch ( error ) {
            return sendError(res, 500, error);
      } 
};

const GetCreatorByTagId = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const creators = await _creatorRepository.FindByTagId(id);
            if(creators.length == 0) {
                  return sendError(response, 404, 'video not found');
            }

            return sendResponse(response, 200, creators);
      } catch(error) {
            console.error('Error find creator by id: ', error);
            return sendError(response, 500, error);
      }
}

export const CreateCreator = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const createdCreator = await _creatorService.CreateCreator(req);
            return sendResponse(res, 201, createdCreator)
      } catch(error) { 
            console.error('Error in CreateCreator: ', error);
            sendError(res, 500, error);
      }
};

export const UpdateCreator = async (req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const updatedCreator = await _creatorService.UpdateCreator(req, id);
            sendResponse(res, 200, updatedCreator);
      }
      catch(error) {
            console.error('Error updating creator: ', error);
            sendError(res, 500, error);
      }
};

export const DeleteCreator = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            
            await _creatorService.DeleteCreator(id);
            return sendResponse(res, 200, { message: 'Creator deleted'});
      } catch(error) {
            console.error('Error deleting creator in controller:', error);
            return sendError(res, 500, new Error('Error deleting creator.'));
      }
}

export const creator_controller = {
      getCreatorById,
      GetCreators,
      GetCreatorByTagId,
}




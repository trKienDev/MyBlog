import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { UploadFile } from "../utils/file.utils.js";
import { CreatorRepository } from "../repository/creator.repository.js";
import { CreatorService } from "../services/creator.service.js";
import { CreatorDTO } from "../dtos/creator.dto.js";
import Creator from "../models/creator.model.js";

const repository = new CreatorRepository();
const service = new CreatorService(repository);

export const GetCreators = async ( req: CustomRequest , res: ServerResponse ) => {
      try {
            const creators = await Creator.find().populate('studio', 'name');
            sendResponse(res, 200, creators);
      }
      catch ( error ) {
              sendError(res, 500, error);
      } 
};

export const CreateCreator = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const { imgName } = await UploadFile(req, "creator/avatar");
            const { name, birth, skin, studio, body, breast } = req.body;

            const creatorData: CreatorDTO = {
                  name,
                  birth: new Date(birth),
                  skin,
                  studio,
                  body,
                  breast,
                  image: imgName
            };

            const result = await service.CreateCreator(creatorData);
            
            if(!result.success) {
                  return sendResponse(res, result.code, { message: result.message });
            }

            return sendResponse(res, result.code, result.data);
      } catch(error) { 
            console.error('Error in CreateCreator: ', error);
            sendError(res, 500, error);
      }
};

export const UpdateCreator = async (req: CustomRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            if(!id) {
                  return sendError(res, 400, new Error('Cannot found id.'));
            } 

            const updatedCreator = await service.UpdateCreator(req, id);
            sendResponse(res, 200, updatedCreator);
      }
      catch(error) {
            sendError(res, 500, error);
      }
};




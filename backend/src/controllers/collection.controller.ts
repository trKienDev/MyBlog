import { IncomingMessage, ServerResponse } from "http";
import { CollectionRepository } from "../repository/collection.repository.js";
import { CollectionService } from "../services/collection.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new CollectionRepository();
const service = new CollectionService(repository);

export const GetCollections = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const collections = await repository.GetCollections();
            return sendResponse(res, 200, collections);
      } catch(error) {  
            return sendError(res, 500, error);
      }
}

export const GetCollection_byId = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const collection = await repository.GetCollection_byId(id);
            if(collection == null) {
                  return sendError(res, 404, 'collection not found');
            }
            return sendResponse(res, 200, collection);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

export const createCollection = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdCollection = await service.createCollection(req);
            sendResponse(res, 200, createdCollection);
      } catch(error) {
            console.error("error in createCollection - collection.controller: ", error);
            return sendError(res, 500, error);
      }
}
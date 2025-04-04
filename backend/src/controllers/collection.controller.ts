import { IncomingMessage, ServerResponse } from "http";
import { CollectionRepository } from "../repository/collection.repository.js";
import { CollectionService } from "../services/collection.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

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

export const createCollection = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdCollection = await service.createCollection(req);
            sendResponse(res, 200, createdCollection);
      } catch(error) {
            console.error("error in createCollection - collection.controller: ", error);
            return sendError(res, 500, error);
      }
}
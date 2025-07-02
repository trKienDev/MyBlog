import { IncomingMessage, ServerResponse } from "http";
import { CollectionService } from "../services/collection.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { CollectionRepository } from "../repositories/collection.repository.js";

const _collectionRepository = new CollectionRepository();
const _collectionService = new CollectionService(_collectionRepository);

export const getCollections = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const collections = await _collectionRepository.getCollections();
            return sendResponse(res, 200, collections);
      } catch(error) {  
            return sendError(res, 500, error);
      }
}

const getCollectionById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const collection = await _collectionRepository.getCollectionById(id);
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
            const createdCollection = await _collectionService.createCollection(req);
            sendResponse(res, 200, createdCollection);
      } catch(error) {
            console.error("error in createCollection - collection.controller: ", error);
            return sendError(res, 500, error);
      }
}

const collection_controller = {
      getCollections,
      getCollectionById,
      createCollection,
}
export default collection_controller;
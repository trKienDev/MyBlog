import { IncomingMessage, ServerResponse } from "http";
import { CollectionRepository } from "../repository/collection.repository.js";
import { CollectionService } from "../services/collection.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

const repository = new CollectionRepository();
const service = new CollectionService(repository);

export const createCollection = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdCollection = await service.createCollection(req);
            sendResponse(res, 200, createdCollection);
      } catch(error) {
            console.log("error in createCollection - collection.controller");
            return sendError(res, 500, error);
      }
}
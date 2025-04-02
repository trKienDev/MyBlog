import { IncomingMessage, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { TagRepostory } from "../repository/tag.repository.js";
import { TagService } from "../services/tag.service.js";

const repository = new TagRepostory();
const service = new TagService(repository);

export const getTags = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags = await repository.GetTags();
            return sendResponse(res, 200, tags);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

export const createTag = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdTag = await service.CreateTag(req);
            sendResponse(res, 200, createdTag);
      } catch(error) {
            return sendError(res, 500, error);
      }
}
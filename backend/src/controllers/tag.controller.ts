import { IncomingMessage, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { TagRepostory } from "../repository/tag.repository.js";
import { TagService } from "../services/tag.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

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

export const GetTag_byId = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const tag = await repository.GetTag_byId(id);
            if(tag == null) {
                  return sendError(res, 404, 'tag not found');
            }
            return sendResponse(res, 200, tag);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

export const GetFilmTags = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const filmTags = await repository.GetFilmTags();
            return sendResponse(res, 200, filmTags);
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
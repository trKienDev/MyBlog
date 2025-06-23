import { IncomingMessage, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { TagRepostory } from "../repository/tag.repository.js";
import { TagService } from "../services/tag.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new TagRepostory();
const service = new TagService(repository);

const GetTags = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags = await repository.getTags();
            return sendResponse(res, 200, tags);
      } catch(error) {
            console.error('Error getting tags: ', error);
            return sendError(res, 500, error);
      }
}

const getTagById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const tag = await repository.findById(id);
            if(tag == null) {
                  return sendError(res, 404, 'tag not found');
            }
            return sendResponse(res, 200, tag);
      } catch(error) {
            console.error('Error creating tags: ', error);
            return sendError(res, 500, error);
      }
}

const GetTagsByFilm = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const filmTags = await repository.getFilmTags();
            return sendResponse(response, 200, filmTags);
      } catch(error) {
            console.error('Error getting tag by film: ', error);
            return sendError(response, 500, error);
      }     
}

const getTagsByVideo = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags_video = await repository.getTagsByVideo();
            return sendResponse(res, 200, tags_video);
      } catch(error) {  
            console.error('Error getting tag by video: ', error);
            return sendError(res, 500, error);
      }
}

const GetTagsForVideoHomepage = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const tags = await repository.GetTagsByVideoHomepage();
            return sendResponse(response, 200, tags);
      } catch(error) {
            console.error('Error getting tags by video in homepage');
            return sendError(response, 500, error);
      }
}

const getTagsByAction = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags_action = await repository.getTagsByAction();
            return sendResponse(res, 200, tags_action);
      } catch(error) {
            console.error('Error getting tag by video: ', error);
            return sendError(res, 500, error);
      }
}

const getTagsByCreator = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const tags_creator = await repository.GetTagsByCreator();
            return sendResponse(response, 200, tags_creator);
      } catch(error) {
            console.error('Error getting tag by video: ', error);
            return sendError(response, 500, error);
      }
}

export const createTag = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdTag = await service.createTag(req);
            sendResponse(res, 200, createdTag);
      } catch(error) {
             console.error('Error creating tag by film: ', error);
            return sendError(res, 500, error);
      }
}

export const tag_controller = {
      GetTags,
      getTagById,
      GetTagsByFilm,
      GetTagsForVideoHomepage,
      getTagsByVideo,
      getTagsByAction,
      getTagsByCreator,
}
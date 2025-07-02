import { IncomingMessage, request, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { TagService } from "../services/tag.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { TagRepostory } from "../repositories/tag.repository.js";

const _tagRepository = new TagRepostory();
const _tagService = new TagService(_tagRepository);

const GetTags = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const tags = await _tagRepository.getTags();
            return sendResponse(response, 200, tags);
      } catch(error) {
            console.error('Error getting tags: ', error);
            return sendError(response, 500, error);
      }
}
const GetTagById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const tag = await _tagRepository.findById(id);
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
            const filmTags = await _tagRepository.getFilmTags();
            return sendResponse(response, 200, filmTags);
      } catch(error) {
            console.error('Error getting tag by film: ', error);
            return sendError(response, 500, error);
      }     
}
const getTagsByVideo = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags_video = await _tagRepository.getTagsByVideo();
            return sendResponse(res, 200, tags_video);
      } catch(error) {  
            console.error('Error getting tag by video: ', error);
            return sendError(res, 500, error);
      }
}
const GetTagsByImage = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags_image = await _tagRepository.GetTagsByImage();
            return sendResponse(res, 200, tags_image);
      } catch(error) {  
            console.error('Error getting tag by image: ', error);
            return sendError(res, 500, error);
      }
}
const GetTagsForVideoHomepage = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const tags = await _tagRepository.GetTagsByVideoHomepage();
            return sendResponse(response, 200, tags);
      } catch(error) {
            console.error('Error getting tags by video in homepage');
            return sendError(response, 500, error);
      }
}
const getTagsByAction = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags_action = await _tagRepository.getTagsByAction();
            return sendResponse(res, 200, tags_action);
      } catch(error) {
            console.error('Error getting tag by action: ', error);
            return sendError(res, 500, error);
      }
}
const getTagsByCreator = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const tags_creator = await _tagRepository.GetTagsByCreator();
            return sendResponse(response, 200, tags_creator);
      } catch(error) {
            console.error('Error getting tag by creator: ', error);
            return sendError(response, 500, error);
      }
}
const GetTagsByManga = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const manga_tags = await _tagRepository.GetTagsByManga();
            return sendResponse(response, 200, manga_tags);
      } catch(error) {
            console.error('Error getting tag by manga: ', error);
            return sendError(response, 500, error);
      }
}
const GetTagsByAnime = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const anime_tags = await _tagRepository.GetTagsByAnime();
            return sendResponse(response, 200, anime_tags);
      } catch(error) {
            console.error('Error getting tag by anime: ', error);
            return sendError(response, 500, error);
      }
}

const CreateTag = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const created_tag = await _tagService.CreateTag(request);
            sendResponse(response, 200, created_tag);
      } catch(error) {
             console.error('Error creating tag by film: ', error);
            return sendError(response, 500, error);
      }
}

const tag_controller = {
      GetTags,
      GetTagById,
      GetTagsByFilm,
      GetTagsForVideoHomepage,
      getTagsByVideo,
      getTagsByAction,
      getTagsByCreator,
      GetTagsByImage,
      GetTagsByManga,
      GetTagsByAnime,
      CreateTag
}
export default tag_controller;
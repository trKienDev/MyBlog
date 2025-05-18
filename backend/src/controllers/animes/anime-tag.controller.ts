import { IncomingMessage, ServerResponse } from "http";
import { AnimeTagRepository } from "../../repository/animes/anime-tag.repository.js";
import { AnimeTagService } from "../../services/animes/anime-tag.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";

const repository = new AnimeTagRepository();
const service = new AnimeTagService(repository);
  
const getAnimeTags = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const anime_tags = await repository.getAnimeTags();
            return sendResponse(res, 200, anime_tags);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const getAnimeTagById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const anime_tag = await repository.getAnimeTagById(id);
            if(!anime_tag) {
                  return sendError(res, 404, 'anime tag not found');
            }
            return sendResponse(res, 200, anime_tag);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const getAnimeTagsByFilm = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const animeFilm_tags = await repository.getAnimeTagsByFilm();
            return sendResponse(res, 200, animeFilm_tags);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const getAnimeTagByAction = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags_action = await repository.getAnimeTagByAction();
            return sendResponse(res, 200, tags_action);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const getAnimeVideoTags = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const tags = await repository.getAnimeVideoTags();
            return sendResponse(res, 200, tags);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const createAnimeTag = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const created_animeTag = await service.createAnimeTag(req);
            sendResponse(res, 200, created_animeTag);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const animeTag_controller = {
      getAnimeTags,
      getAnimeTagById,
      getAnimeTagByAction,
      getAnimeTagsByFilm,
      getAnimeVideoTags,
      createAnimeTag,
}
export default animeTag_controller;
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
      createAnimeTag,
}
export default animeTag_controller;
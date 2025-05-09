import { IncomingMessage, ServerResponse } from "http";
import { AnimeTagRepository } from "../../repository/animes/anime-tag.repository.js";
import { AnimeTagService } from "../../services/animes/anime-tag.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";

const repository = new AnimeTagRepository();
const service = new AnimeTagService(repository);

const createAnimeTag = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const created_animeTag = await service.createAnimeTag(req);
            sendResponse(res, 200, created_animeTag);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const animeTag_controller = {
      createAnimeTag,
}
export default animeTag_controller;
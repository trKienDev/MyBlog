import { IncomingMessage, ServerResponse } from "http";
import { AnimeStudioRepository } from "../../repository/animes/anime-studio.repository.js";
import { AnimeStudioService } from "../../services/animes/anime-studio.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";

const animeStudio_repository = new AnimeStudioRepository;
const animeStudio_service = new AnimeStudioService(animeStudio_repository);

const createAnimeStudio = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const created_animeStudio = await animeStudio_service.createAnimeStudio(req);
            sendResponse(res, 200, created_animeStudio);
      } catch(error) {
            console.error('error creating new anime studio: ', error);
            sendError(res, 404, error);
      }
}

const animeStudio_controller = {
      createAnimeStudio,
}
export default animeStudio_controller;
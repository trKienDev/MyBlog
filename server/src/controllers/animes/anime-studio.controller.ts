import { IncomingMessage, ServerResponse } from "http";
import { AnimeStudioRepository } from "../../repository/animes/anime-studio.repository.js";
import { AnimeStudioService } from "../../services/animes/anime-studio.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";

const animeStudio_repository = new AnimeStudioRepository;
const animeStudio_service = new AnimeStudioService(animeStudio_repository);

const getAnimeStudioById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const studio = await animeStudio_repository.findById(id);
            return sendResponse(res, 200, studio);
      } catch(error) {
            console.error('Error retrieving studio by id: ', error);
            return sendError(res, 500, new Error('Error retrieving studio from repository'));
      }
}

const getAnimeStudios = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const anime_studios = await animeStudio_repository.getAnimeStudios();
            return sendResponse(res, 200, anime_studios);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

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
      getAnimeStudioById,
      getAnimeStudios,
      createAnimeStudio,
}
export default animeStudio_controller;
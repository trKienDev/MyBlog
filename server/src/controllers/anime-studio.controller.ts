import { IncomingMessage, ServerResponse } from "http";
import { AnimeStudioRepository } from "../repositories/anime-studio.repository.js";
import { AnimeStudioService } from "../services/anime-studio.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { sendError, sendResponse } from "../middlewares/response.js";


const _animeStudioRepository = new AnimeStudioRepository();
const _animeStudioService = new AnimeStudioService(_animeStudioRepository);

const getAnimeStudioById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const studio = await _animeStudioRepository.findById(id);
            return sendResponse(response, 200, studio);
      } catch(error) {
            console.error('Error retrieving studio by id: ', error);
            return sendError(response, 500, new Error('Error retrieving studio from repository'));
      }
}

const getAnimeStudios = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const anime_studios = await _animeStudioRepository.getAnimeStudios();
            return sendResponse(response, 200, anime_studios);
      } catch(error) {
            return sendError(response, 500, error);
      }
}

const createAnimeStudio = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const created_animeStudio = await _animeStudioService.createAnimeStudio(request);
            sendResponse(response, 200, created_animeStudio);
      } catch(error) {
            console.error('error creating new anime studio: ', error);
            sendError(response, 404, error);
      }
}

const animeStudio_controller = {
      getAnimeStudioById,
      getAnimeStudios,
      createAnimeStudio,
}
export default animeStudio_controller;
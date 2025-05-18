import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { AnimeFilmRepository } from "../../repository/animes/anime-film.repository.js";
import { AnimeFilmService } from "../../services/animes/anime-film.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";

const repository = new AnimeFilmRepository();
const service = new AnimeFilmService(repository);

const getAnimeFilms = async(req: IncomingMessage, res: ServerResponse) => {
      try {  
            const anime_films = await repository.getAnimeFilms();
            if(anime_films == null) {
                  return sendError(res, 500, 'Failed to get anime films');
            }

            return sendResponse(res, 200, anime_films);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const findAnimeById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const anime = await repository.findById(id);
            return sendResponse(res, 200, anime);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const createAnimeFilm = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const new_animeFilm = await service.createAnimeFilm(req);
            sendResponse(res, 201, new_animeFilm);
      } catch(error) {
            console.error('Error creating anime film: ', error);
            return sendError(res, 500, error);
      }
}

const updateAnimeFilm = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const updated_animeFilm = await service.updateFilm(req);
            return sendResponse(res, 200, updated_animeFilm);
      } catch(error) {
            console.error('Error updating anime film: ', error);
            return sendError(res, 500, error);
      }
}

const animeFilm_controller = {
      getAnimeFilms,
      findAnimeById,
      createAnimeFilm,
      updateAnimeFilm,
}
export default animeFilm_controller;
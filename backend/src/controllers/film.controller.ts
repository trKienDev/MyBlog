import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { FilmRepository } from "../repository/film.repository.js";
import { FilmService } from "../services/film.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new FilmRepository();
const service = new FilmService(repository);

export const GetFilms = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const films = await repository.GetFilms();
            if(films == null) {
                  return sendError(res, 500, 'Failed to get films');
            }
            return sendResponse(res, 200, films);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

export const CreateFilm = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const newFilm = await service.CreateFilm(req);
            sendResponse(res, 201, newFilm);
      } catch(error) {
            console.error("Error creating film: ", error);
            return sendError(res, 500, error);
      }
}

export const update_film = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const updated_film = await service.update_film(req);
            return sendResponse(res, 200, update_film);
      } catch(error) {
            return sendError(res, 500, error);
      }
}
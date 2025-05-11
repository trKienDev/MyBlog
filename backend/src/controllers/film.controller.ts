import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { FilmRepository } from "../repository/film.repository.js";
import { FilmService } from "../services/film.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new FilmRepository();
const service = new FilmService(repository);

const getFilms = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const films = await repository.getFilms();
            if(films == null) {
                  return sendError(res, 500, 'Failed to get films');
            }
            return sendResponse(res, 200, films);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const findFilmById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const film = await repository.findById(id);
            if(film == null) {
                  return sendError(res, 404, 'film not found');
            }
            return sendResponse(res, 200, film);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const findFilmsByStudioAndCode = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const { studio_id, code_id } = req.params as { studio_id: string; code_id: string };
            const films = await repository.findFilmsByStudioAndCode(studio_id, code_id);
            return sendResponse(res, 200, films);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const createFilm = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const newFilm = await service.createFilm(req);
            sendResponse(res, 201, newFilm);
      } catch(error) {
            console.error("Error creating film: ", error);
            return sendError(res, 500, error);
      }
}

const updateFilm = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const updated_film = await service.updateFilm(req);
            return sendResponse(res, 200, updated_film);
      } catch(error) {
            console.error("Error in updateFilm - film.controller: ", error);
            return sendError(res, 500, error);
      }
}

export const filmController = {
      getFilms,
      findFilmById,
      createFilm,
      updateFilm,
      findFilmsByStudioAndCode,
}
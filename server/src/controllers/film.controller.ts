import { request, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { FilmRepository } from "../repository/film.repository.js";
import { FilmService } from "../services/film.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new FilmRepository();
const service = new FilmService(repository);

const getFilms = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const films = await repository.getFilms();
            return sendResponse(response, 200, films);
      } catch(error) {
            console.error('Error getting films: ', error);
            return sendError(response, 500, error);
      }
}

const findFilmById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const film = await repository.findById(id);
            if(film == null) {
                  return sendError(response, 404, 'film not found');
            }
            return sendResponse(response, 200, film);
      } catch(error) {
            console.error('Error getting film by id: ', error);
            return sendError(response, 500, error);
      }
}

const findFilmsByStudioAndCode = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const { studio_id, code_id } = request.params as { studio_id: string; code_id: string };
            const films = await repository.findFilmsByStudioAndCode(studio_id, code_id);
            return sendResponse(response, 200, films);
      } catch(error) {
            console.error('Error finding film by studio and code: ', error);
            return sendError(response, 500, error);
      }
}

const FindFIlmsByCreator = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const creator_id = request.params?.id;
            const films = await repository.FindByCreatorId(creator_id);
            return sendResponse(response, 200, films);
      } catch(error) {
            console.error('Error finding films by creator: ', error);
            return sendError(response, 500, error);
      }
}

const FindFilmsByStudio = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const studio_id = request.params?.id;
            const films = await repository.FindByStudioId(studio_id);
            return sendResponse(response, 200, films);
      } catch(error) {
            console.error('Error finding films by studio: ', error);
            return sendError(response, 500, error);
      }
}

const GetFilmsByCollection = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const collection_id = request.params?.id;
            const films = await repository.FindByCollectionId(collection_id);
            return sendResponse(response, 200, films);
      } catch(error) {
            console.error('Error finding films by studio: ', error);
            return sendError(response, 500, error);
      }
}


const FindFilmsByTagId = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const tag_id = request.params?.id;
            const films = await repository.FindFilmsByTagId(tag_id);
            return sendResponse(response, 200, films);
      } catch(error) {
            console.error('Error finding films by studio: ', error);
            return sendError(response, 500, error);
      }
}

const createFilm = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const newFilm = await service.createFilm(request);
            sendResponse(response, 201, newFilm);
      } catch(error) {
            console.error("Error creating film: ", error);
            return sendError(response, 500, error);
      }
}

const updateFilm = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const updated_film = await service.updateFilm(request);
            return sendResponse(response, 200, updated_film);
      } catch(error) {
            console.error("Error in updateFilm - film.controller: ", error);
            return sendError(response, 500, error);
      }
}

const UpdateFilmCollections = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const updateCollectionsFilm = await service.UpdateFilmCollections(request);
            return sendResponse(response, 200, updateCollectionsFilm);
      } catch(error) {
            console.error('Error updating film collections: ', error);
            return sendError(response, 500, error);
      }
}

export const filmController = {
      getFilms,
      findFilmById,
      createFilm,
      updateFilm,
      findFilmsByStudioAndCode,
      FindFIlmsByCreator,
      FindFilmsByStudio,
      GetFilmsByCollection,
      FindFilmsByTagId,
      UpdateFilmCollections,
}
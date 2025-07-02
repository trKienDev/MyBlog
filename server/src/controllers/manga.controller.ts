import { IncomingMessage, request, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { MangaService } from "../services/manga.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { MangaRepository } from "../repositories/manga.repository.js";

const _mangaRepository = new MangaRepository();
const _mangaService = new MangaService(_mangaRepository);

const getMangas = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const mangas = await _mangaRepository.getMangas();
            return sendResponse(response, 200, mangas);
      } catch(error) {
            console.error('Error getting mangas: ', error);
            return sendError(response, 500, error);
      }
}

const FindMangaById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request?.params.id;
            const manga = await _mangaRepository.findMangaById(id);
            return sendResponse(response, 201, manga);
      } catch(error) {
            console.error('Error finding manga by id: ', error);
            return sendError(response, 500, error);
      }
}

const initialManga = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const initialized_manga = await _mangaService.initialManga(request);
            return sendResponse(response, 201, initialized_manga);
      } catch(error) {
            console.error('Error creating manga: ', error);
            sendError(response, 500, error);
      }
}

const addImagesToInitializedManga = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const updated_manga = await _mangaService.addImagesToInitializedManga(request);
            return sendResponse(response, 201, updated_manga);
      } catch(error) {
            console.error('Error adding images to initialized manga: ', error);
            return sendError(response, 500, error);
      }
}

export const manga_controller = {
      getMangas,
      FindMangaById,
      initialManga,
      addImagesToInitializedManga,
}

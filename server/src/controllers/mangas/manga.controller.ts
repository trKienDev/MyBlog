import { IncomingMessage, request, ServerResponse } from "http";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { MangaRepository } from "../../repository/mangas/manga.repository.js";
import { MangaService } from "../../services/mangas/manga.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";

const repository = new MangaRepository();
const service = new MangaService(repository);

const getMangas = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const mangas = await repository.getMangas();
            return sendResponse(response, 200, mangas);
      } catch(error) {
            console.error('Error getting mangas: ', error);
            return sendError(response, 500, error);
      }
}

const FindMangaById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request?.params.id;
            const manga = await repository.findMangaById(id);
            return sendResponse(response, 201, manga);
      } catch(error) {
            console.error('Error finding manga by id: ', error);
            return sendError(response, 500, error);
      }
}

const initialManga = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const initialized_manga = await service.initialManga(request);
            return sendResponse(response, 201, initialized_manga);
      } catch(error) {
            console.error('Error creating manga: ', error);
            sendError(response, 500, error);
      }
}

const addImagesToInitializedManga = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const updated_manga = await service.addImagesToInitializedManga(request);
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

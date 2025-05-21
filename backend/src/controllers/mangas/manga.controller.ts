import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { MangaRepository } from "../../repository/mangas/manga.repository.js";
import { MangaService } from "../../services/mangas/manga.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";

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

const createManga = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const created_manga = await service.createManga(request);
            return sendResponse(response, 201, created_manga);
      } catch(error) {
            console.error('Error creating manga: ', error);
            sendError(response, 500, error);
      }
}

export const manga_controller = {
      getMangas,
      createManga,
}

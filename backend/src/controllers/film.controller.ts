import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { FilmRepository } from "../repository/film.repository.js";
import { FilmService } from "../services/film.service.js";

const repository = new FilmRepository();
const service = new FilmService(repository);

export const CreateFilm = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const newFilm = await service.CreateFilm(req);
            sendResponse(res, 201, newFilm);
      } catch(error) {
            console.error("Error creating film: ", error);
            return sendError(res, 500, error);
      }
}
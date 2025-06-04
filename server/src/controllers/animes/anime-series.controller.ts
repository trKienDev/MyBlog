import { IncomingMessage, ServerResponse } from "http";
import { AnimeSeriesRepository } from "../../repository/animes/anime-series.repository.js"
import { AnimeSeriesService } from "../../services/animes/anime-series.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";

const repository = new AnimeSeriesRepository;
const service = new AnimeSeriesService(repository);

const getAnimeSeriesById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const anime_series = await repository.getAnimeSeriesById(id);
            if(!anime_series) {
                  return sendError(res, 404, 'anime series not found');
            }
            return sendResponse(res, 200, anime_series);
      } catch(error) {
            console.error('Error get anime series by id: ', error);
            return sendError(res, 500, error);
      }
}

const getAnimeSeries = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const anime_series = await repository.getAnimeSeries();
            return sendResponse(res, 200, anime_series);
      } catch(error) {  
            return sendError(res, 500, error);
      }
}

const createAnimeSeries = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const created_animeSeries = await service.createAnimeSeries(req);
            sendResponse(res, 200, created_animeSeries);
      } catch(error) {
            console.error('Error creating new anime series: ', error);
            sendError(res, 404,error);
      }
}

const animeSeries_controller = {
      getAnimeSeriesById,
      getAnimeSeries,
      createAnimeSeries,
}
export default animeSeries_controller;
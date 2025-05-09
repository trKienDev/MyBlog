import { IncomingMessage, ServerResponse } from "http";
import { AnimeSeriesRepository } from "../../repository/animes/anime-series.repository.js"
import { AnimeSeriesService } from "../../services/animes/anime-series.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";

const animeSeries_repository = new AnimeSeriesRepository;
const animeSeries_service = new AnimeSeriesService(animeSeries_repository);

const getAnimeSeries = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const anime_series = await animeSeries_repository.getAnimeSeries();
            return sendResponse(res, 200, anime_series);
      } catch(error) {  
            return sendError(res, 500, error);
      }
}

const createAnimeSeries = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const created_animeSeries = await animeSeries_service.createAnimeSeries(req);
            sendResponse(res, 200, created_animeSeries);
      } catch(error) {
            console.error('Error creating new anime series: ', error);
            sendError(res, 404,error);
      }
}

const animeSeries_controller = {
      getAnimeSeries,
      createAnimeSeries,
}
export default animeSeries_controller;
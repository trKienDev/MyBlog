import { IncomingMessage, ServerResponse } from "http";
import { AnimeSeriesRepository } from "../repositories/anime-series.repository";
import { AnimeSeriesService } from "../services/anime-series.service";
import { ValidateIdRequest } from "../interfaces/validated-id-request";
import { sendError, sendResponse } from "../middlewares/response";

const _animeSeriesRepository = new AnimeSeriesRepository();
const _animeSeriesService = new AnimeSeriesService(_animeSeriesRepository);

const getAnimeSeriesById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const anime_series = await _animeSeriesRepository.getAnimeSeriesById(id);
            if(!anime_series) {
                  return sendError(response, 404, 'anime series not found');
            }
            return sendResponse(response, 200, anime_series);
      } catch(error) {
            console.error('Error get anime series by id: ', error);
            return sendError(response, 500, error);
      }
}

const getAnimeSeries = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const anime_series = await _animeSeriesRepository.getAnimeSeries();
            return sendResponse(response, 200, anime_series);
      } catch(error) {  
            return sendError(response, 500, error);
      }
}

const createAnimeSeries = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const created_animeSeries = await _animeSeriesService.createAnimeSeries(request);
            sendResponse(response, 200, created_animeSeries);
      } catch(error) {
            console.error('Error creating new anime series: ', error);
            sendError(response, 404,error);
      }
}

const animeSeries_controller = {
      getAnimeSeriesById,
      getAnimeSeries,
      createAnimeSeries,
}
export default animeSeries_controller;
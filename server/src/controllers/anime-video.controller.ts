import { IncomingMessage, ServerResponse } from "http";
import { AnimeVideoRepository } from "../repositories/anime-video.repository";
import { AnimeVideoService } from "../services/anime-video.service";
import { ValidateIdRequest } from "../interfaces/validated-id-request";
import { sendError, sendResponse } from "../middlewares/response";
import { CustomRequest } from "../middlewares/json-parser";


const _animeVideoRepository = new AnimeVideoRepository();
const _animeVideoService = new AnimeVideoService(_animeVideoRepository);

const GetAnimeVideoById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const anime_video = await _animeVideoRepository.findAnimeVideoById(id);
            return sendResponse(response, 200, anime_video);
      } catch(error) {
            console.error('Error getting anime video by id: ', error);
            return sendError(response, 500, error);
      }
}
 
const getAnimeVideos = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const anime_videos = await _animeVideoRepository.getAnimeVideos();
            if(anime_videos == null) {
                  return sendError(res, 500, 'Cannot find any anime videos');
            }

            return sendResponse(res, 201, anime_videos);
      } catch(error) {
            console.error('Error getting anime videos: ', error);
            return sendError(res, 500, error);
      }
}

const createAnimeVideo = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const created_video = await _animeVideoService.createAnimeVideo(req);
            sendResponse(res, 201, created_video);
      } catch(error) {
            console.error('Error creating anime videos: ', error);
            return sendError(res, 500, error);
      }
}

const updateAnimeVideo  = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const updated_video = await _animeVideoService.updateAnimeVideo(req);
            return sendResponse(res, 201, updated_video);
      } catch(error) {
            console.error('Error updating anime video: ', error);
            return sendError(res, 500, error);
      }
}

const animeVideo_controller = {
      getAnimeVideos,
      GetAnimeVideoById,
      createAnimeVideo,
      updateAnimeVideo,
}
export default animeVideo_controller;
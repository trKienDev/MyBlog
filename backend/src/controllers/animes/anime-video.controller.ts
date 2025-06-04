import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { AnimeVIdeoRepository } from "../../repository/animes/anime-video.repository.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { AnimeVideoService } from "../../services/animes/anime-video.service.js";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";

const repository = new AnimeVIdeoRepository();
const service = new AnimeVideoService(repository);

const getAnimeVideos = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const anime_videos = await repository.getAnimeVideos();
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
            const created_video = await service.createAnimeVideo(req);
            sendResponse(res, 201, created_video);
      } catch(error) {
            console.error('Error creating anime videos: ', error);
            return sendError(res, 500, error);
      }
}

const updateAnimeVideo  = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const updated_video = await service.updateAnimeVideo(req);
            return sendResponse(res, 201, updated_video);
      } catch(error) {
            console.error('Error updating anime video: ', error);
            return sendError(res, 500, error);
      }
}

const animeVideo_controller = {
      getAnimeVideos,
      createAnimeVideo,
      updateAnimeVideo,
}
export default animeVideo_controller;
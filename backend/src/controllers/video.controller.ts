import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { VideoService } from "../services/video.service.js";
import { VideoRepository } from "../repository/video.repository.js";

const repository = new VideoRepository();
const service = new VideoService(repository);

const getVideos = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const videos = await repository.getVIdeos();
            return sendResponse(res, 200, videos);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const createVideo = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const saved_video = await service.createVideo(req);
            sendResponse(res, 201, saved_video);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

export const video_controller = {
      getVideos,
      createVideo,
}
import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { VideoService } from "../services/video.service.js";
import { VideoRepository } from "../repository/video.repository.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const video_repository = new VideoRepository();
const video_service = new VideoService(video_repository);

const getVideos = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const videos = await video_repository.getVIdeos();
            return sendResponse(res, 200, videos);
      } catch(error) {
            console.error('Error get all videos: ', error);
            return sendError(res, 500, error);
      }
}

const createVideo = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const saved_video = await video_service.createVideo(req);
            sendResponse(res, 201, saved_video);
      } catch(error) {
            console.error('Error creating video: ', error);
            return sendError(res, 500, error);
      }
}

const updatedVIdeo = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const updated_video = await video_service.updateVideo(req);
            return sendResponse(res, 200, updated_video);
      } catch(error) {
            console.error('Error updating video: ', error);
            return sendError(res, 500, error);
      }
}

const video_controller = {
      getVideos,
      createVideo,
      updatedVIdeo,
}
export default video_controller;
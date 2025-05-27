import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { VideoService } from "../services/video.service.js";
import { VideoRepository } from "../repository/video.repository.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new VideoRepository();
const service = new VideoService(repository);

const getVideos = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const videos = await repository.getVIdeos();
            return sendResponse(response, 200, videos);
      } catch(error) {
            console.error('Error get all videos: ', error);
            return sendError(response, 500, error);
      }
}

const findVideoById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const video = await repository.findById(id);
            if(video == null) {
                  return sendError(response, 404, 'video not found');
            } 
            
            return sendResponse(response, 200, video);
      } catch(error) {
            console.error('Error find video by id: ', error);
            return sendError(response, 500, error);
      }
}

const createVideo = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const saved_video = await service.createVideo(req);
            sendResponse(res, 201, saved_video);
      } catch(error) {
            console.error('Error creating video: ', error);
            return sendError(res, 500, error);
      }
}

const updatedVIdeo = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const updated_video = await service.updateVideo(req);
            return sendResponse(res, 200, updated_video);
      } catch(error) {
            console.error('Error updating video: ', error);
            return sendError(res, 500, error);
      }
}

const video_controller = {
      getVideos,
      findVideoById,
      createVideo,
      updatedVIdeo,
}
export default video_controller;
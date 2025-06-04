import { request, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { VideoService } from "../services/video.service.js";
import { VideoRepository } from "../repository/video.repository.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new VideoRepository();
const video_service = new VideoService(repository);

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

const findVideosByCreatorId = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const creator_id = request.params?.id;
            const videos = await repository.findByCreatorId(creator_id);
            return sendResponse(response, 200, videos);
      } catch(error) {
            console.error('Error finding videos by creator', error);
            return sendError(response, 500, error);
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

const addPlaylistToVideo = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const addedPlaylist_video = await video_service.addPlaylistsToVideo(request);
            return sendResponse(response, 200, addedPlaylist_video);
      } catch(error) {
            console.error('Error adding playlist to video: ', error);
            return sendError(response, 500, error);
      }
}

const increaseVideoViewsByOne = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const video_increaseViewByOne = await video_service.increaseVIdeoViewsByOne(request);
            return sendResponse(response, 200, video_increaseViewByOne);
      } catch(error) {
            console.error('Error increasing video views by one');
            return sendError(response, 500, error);
      }
}

const video_controller = {
      getVideos,
      findVideoById,
      findVideosByCreatorId,
      createVideo,
      updatedVIdeo,
      addPlaylistToVideo,
      increaseVideoViewsByOne,
}
export default video_controller;
import { IncomingMessage, request, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { VideoService } from "../services/video.service.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { FilterVideoPagination } from "../dtos/video.dto.js";
import { VideoRepository } from "../repositories/video.repository.js";

const _videoRepository = new VideoRepository();
const _videoService = new VideoService(_videoRepository);

const getVideos = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const videos = await _videoRepository.getVideos();
            return sendResponse(response, 200, videos);
      } catch(error) {
            console.error('Error get all videos: ', error);
            return sendError(response, 500, error);
      }
}

const getVIdeosPaginated = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const page_number = parseInt(request.query?.page as string) || 1;
            const limit_number = parseInt(request.query?.limit as string) || 10;
            const filters: FilterVideoPagination = {};
            const query = request.query;
            if(query?.tag_id) filters.tag_id = query.tag_id as string;
            if(query?.creator_id) filters.creator_id = query.creator_id as string;
            if(query?.studio_id) filters.studio_id = query.studio_id as string;
            if(query?.code_id) filters.code_id = query.code_id as string;
            if(query?.playlist_ids) filters.playlist_ids = query.playlist_ids as string;
            if(query?.action_id) filters.action_id = query.action_id as string;

            const videos = await _videoService.getPaginatedVideos(page_number, limit_number, filters);
            return sendResponse(response, 200, videos);
      } catch(error) {
            console.error('Error get paginated videos: ', error);
            return sendError(response, 500, error);
      }
}

const GetUniqueVideosPagination = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const page_number = parseInt(request.query?.page as string) || 1;
            const limit_number = parseInt(request.query?.limit as string) || 10;
            const filters: FilterVideoPagination = {};
            const query = request.query;
            if(query?.tag_id) filters.tag_id = query.tag_id as string;
            if(query?.creator_id) filters.creator_id = query.creator_id as string;
            if(query?.studio_id) filters.studio_id = query.studio_id as string;
            if(query?.code_id) filters.code_id = query.code_id as string;
            if(query?.playlist_ids) filters.playlist_ids = query.playlist_ids as string;
            if(query?.action_id) filters.action_id = query.action_id as string;

            const videos = await _videoService.getUniqueVideosPagination(page_number, limit_number, filters);
            return sendResponse(response, 200, videos);
      } catch(error) {
            console.error('Error get paginated videos: ', error);
            return sendError(response, 500, error);
      }
}

const findVideoById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const video = await _videoRepository.findById(id);
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
            const videos = await _videoRepository.findByCreatorId(creator_id);
            return sendResponse(response, 200, videos);
      } catch(error) {
            console.error('Error finding videos by creator: ', error);
            return sendError(response, 500, error);
      }
}

const createVideo = async(req: CustomRequest, res: ServerResponse) => {
      try {
            const saved_video = await _videoService.createVideo(req);
            sendResponse(res, 201, saved_video);
      } catch(error) {
            console.error('Error creating video: ', error);
            return sendError(res, 500, error);
      }
}

const updatedVideo = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const updated_video = await _videoService.updateVideo(req);
            return sendResponse(res, 200, updated_video);
      } catch(error) {
            console.error('Error updating video: ', error);
            return sendError(res, 500, error);
      }
}

const addPlaylistToVideo = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const addedPlaylist_video = await _videoService.addPlaylistsToVideo(request);
            return sendResponse(response, 200, addedPlaylist_video);
      } catch(error) {
            console.error('Error adding playlist to video: ', error);
            return sendError(response, 500, error);
      }
}

const increaseVideoViewsByOne = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const video_increaseViewByOne = await _videoService.increaseVideoViewsByOne(request);
            return sendResponse(response, 200, video_increaseViewByOne);
      } catch(error) {
            console.error('Error increasing video views by one');
            return sendError(response, 500, error);
      }
}

const increaseVideoLikeByOne = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const liked_video = await _videoService.increaseVideoLikeByOne(request);
            return sendResponse(response, 200, liked_video);
      } catch(error) {
            console.error('Error increasing video like by one');
            return sendError(response, 500, error);
      }
}

const video_controller = {
      getVideos,
      getVIdeosPaginated,
      GetUniqueVideosPagination,
      findVideoById,
      findVideosByCreatorId,
      createVideo,
      updatedVideo,
      addPlaylistToVideo,
      increaseVideoViewsByOne,
      increaseVideoLikeByOne,
}
export default video_controller;
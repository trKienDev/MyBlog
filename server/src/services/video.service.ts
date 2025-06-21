import { CreateVideoDTO, iVIdeoPaginatedFilters, UpdateVideoDTO, VideoDTO } from "../dtos/video.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { iVideoRepository } from "../repository/interfaces/ivideo.repository.js";
import { FileService } from "../utils/file.service.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";
import { parseJSON } from "../middlewares/json-parser.js";
import mongoose from "mongoose";
import { iVideo } from "../models/interface/ivideo.model.js";
import { IncomingMessage } from "http";

export class VideoService {
      private video_repository: iVideoRepository;
      constructor(videoRepository: iVideoRepository) {
            this.video_repository = videoRepository;
      }

      async createVideo(req: CustomRequest): Promise<CreateVideoDTO | unknown> {
            const { file_name } = await file_utils.uploadFile(req, UploadFiles.VIDEOS);
            let video_name = request_utils.extractParamFromRequest(req, "name");

            const action_id = request_utils.extractParamFromRequest(req, "action_id");
            const creator_id = request_utils.extractParamFromRequest(req, "creator_id");
            const film_id = request_utils.extractParamFromRequest(req, "film_id");
            const code_id = request_utils.extractParamFromRequest(req, "code_id");
            const studio_id = request_utils.extractParamFromRequest(req, "studio_id");
            const tagId_array = request_utils.extractParamFromRequest(req, "tag_ids");
            const tag_ids: string[] = tagId_array.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            
            const new_video: CreateVideoDTO = {
                  name: video_name,
                  action_id: action_id,
                  creator_id: creator_id,
                  film_id: film_id,
                  code_id: code_id,
                  studio_id: studio_id,
                  tag_ids: tag_ids,
                  file_path: file_name,
            };

            return await this.video_repository.createVideo(new_video);
      }

      async getPaginatedVideos(page: number, limit: number, filters: iVIdeoPaginatedFilters) {
            const { videos, total } = await this.video_repository.FindPaginatedVideos(page, limit, filters);
            const paginated_videos = videos.map(doc => MappingDocToDTO(doc));
            return {
                  videos: paginated_videos,
                  pagination: {
                        page: page,
                        limit: limit,
                        total: total
                  }
            }
      }

      async updateVideo(req: ValidateIdRequest): Promise<UpdateVideoDTO | null> {
            const id = req.params?.id;
            const existing_video = await this.video_repository.findById(id);
            if(!existing_video) throw new Error('Video not found!');

            const { file_name } = await file_utils.uploadFile(req, UploadFiles.VIDEOS);
            const video_name = request_utils.extractParamFromRequest(req, "name");
            const action_id = request_utils.extractParamFromRequest(req, "action_id");
            const creator_id = request_utils.extractParamFromRequest(req, "creator_id");
            const film_id = request_utils.extractParamFromRequest(req, "film_id");
            const code_id = request_utils.extractParamFromRequest(req, "code_id");
            const studio_id = request_utils.extractParamFromRequest(req, "studio_id");
            const tagId_array = request_utils.extractParamFromRequest(req, "tag_ids");
            const tag_ids: string[] = tagId_array.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

            const updatedVideo_data: Record<string, any> = { video_name, action_id, creator_id, film_id, code_id, studio_id, tag_ids};
            
            if(file_name) { 
                  FileService.deleteFile(UploadFiles.VIDEOS, existing_video.file_path);
                  updatedVideo_data.file_path = file_name;
            }

            const updated_video = await this.video_repository.updateVideo(id, updatedVideo_data);
            if(!updated_video) throw new Error("Error updating video");

            return updated_video;
      }

      async addPlaylistsToVideo(request: ValidateIdRequest): Promise<VideoDTO | null> {
            const video_id = request.params?.id;
            const required_fields = ['playlist_ids'];
            const existing_video = await this.video_repository.findById(video_id);

            if(!existing_video) {
                  throw new Error('Video not found');
            }

            const body = await parseJSON(request, required_fields);
            const { playlist_ids } = body;
            if(!playlist_ids) {
                  throw new Error('Missing required information');
            }

            const addedPlaylistVideo = await this.video_repository.addPlaylistsToVideo(video_id, playlist_ids);
            return addedPlaylistVideo;
      }

      async increaseVideoViewsByOne(request: ValidateIdRequest): Promise<VideoDTO | null> {
            const video_id = request.params?.id;
            if(!mongoose.Types.ObjectId.isValid(video_id)) {
                  console.warn("Invalid video_id in format for increasingVideoViewsByOne");
                  throw new Error("Invalid video_id format");
            }

            const existing_video = await this.video_repository.findById(video_id);
            if(existing_video === null) {
                  console.warn("video not found");
                  throw new Error("video not found");
            }

            const updated_video = await this.video_repository.increaseVideoViewsByOne(video_id);
            if(updated_video === null) {
                  console.warn("error increaseVideoViewsByOne in repository");
                  throw new Error("error increaseVideoViewsByOne");
            }

            return updated_video;
      }

      async increaseVideoLikeByOne(request: ValidateIdRequest): Promise<VideoDTO | null> {
            const video_id = request.params?.id;
            if(!mongoose.Types.ObjectId.isValid(video_id)) {
                  console.warn("Invalid video_id in format for increasingVideoLikeByOne");
                  throw new Error("Invalid video_id format");
            }

            const existing_video = await this.video_repository.findById(video_id);
            if(existing_video === null) {
                  console.warn("video not found");
                  throw new Error("video not found");
            }

            const updated_video = await this.video_repository.increaseVideoLikeByOne(video_id);
            if(updated_video === null) {
                  console.warn("error increaseVideoLikeByOne in repository");
                  throw new Error("error increaseVideoLikeByOne");
            }

            return updated_video;
      }
}

function MappingDocToDTO(doc: iVideo): VideoDTO {
      return {
            _id: doc._id,
            name: doc.name,
            action_id: doc.action_id.toString(),
            creator_id: doc.creator_id?.toString() ?? "",
            film_id: doc.film_id.toString(),
            code_id: doc.code_id.toString(),
            studio_id: doc.studio_id.toString(),
            playlist_ids: doc.playlist_ids?.map(id => id.toString()),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            file_path: doc.file_path,
            views: doc.views,
            likes: doc.likes,
      }
}

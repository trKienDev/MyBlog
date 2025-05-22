import { CreateVideoDTO, UpdateVideoDTO } from "../dtos/video.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { iVIdeoRepository } from "../repository/interfaces/ivideo.repository.js";
import { FileService } from "../utils/file.service.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class VideoService {
      private video_repository: iVIdeoRepository;
      constructor(videoRepository: iVIdeoRepository) {
            this.video_repository = videoRepository;
      }

      async createVideo(req: CustomRequest): Promise<CreateVideoDTO | unknown> {
            const { file_name } = await file_utils.uploadFile(req, "videos");
            let video_name = request_utils.extractParamFromRequest(req, "name");

            const existing_video = await this.video_repository.findByName(video_name);
            if(existing_video) {
                  video_name = existing_video.name + '_2';
            }

            const action_id = request_utils.extractParamFromRequest(req, "action_id");
            const playlist_id = request_utils.extractParamFromRequest(req, "playlist_id");
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
                  playlist_id: playlist_id,
                  tag_ids: tag_ids,
                  file_path: file_name,
            };

            return await this.video_repository.createVideo(new_video);
      }

      async updateVideo(req: ValidateIdRequest): Promise<UpdateVideoDTO | null> {
            const id = req.params?.id;
            const existing_video = await this.video_repository.findById(id);
            if(!existing_video) throw new Error('Video not found!');

            const { file_name } = await file_utils.uploadFile(req, "videos");
            const video_name = request_utils.extractParamFromRequest(req, "name");
            const action_id = request_utils.extractParamFromRequest(req, "action_id");
            const playlist_id = request_utils.extractParamFromRequest(req, "playlist_id");
            const creator_id = request_utils.extractParamFromRequest(req, "creator_id");
            const film_id = request_utils.extractParamFromRequest(req, "film_id");
            const code_id = request_utils.extractParamFromRequest(req, "code_id");
            const studio_id = request_utils.extractParamFromRequest(req, "studio_id");
            const tagId_array = request_utils.extractParamFromRequest(req, "tag_ids");
            const tag_ids: string[] = tagId_array.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

            const updatedVideo_data: Record<string, any> = { video_name, action_id, playlist_id, creator_id, film_id, code_id, studio_id, tag_ids};
            
            if(file_name) { 
                  FileService.deleteFile("videos", existing_video.file_path);
                  updatedVideo_data.file_path = file_name;
            }

            const updated_video = await this.video_repository.updateVideo(id, updatedVideo_data);
            if(!updated_video) throw new Error("Error updating video");

            return updated_video;
      }
}
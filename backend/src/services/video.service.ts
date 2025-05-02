import { CreateVideoDTO } from "../dtos/video.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { iVIdeoRepository } from "../repository/interfaces/ivideo.repository.js";
import { uploadFile } from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class VideoService {
      private video_repository: iVIdeoRepository;
      constructor(videoRepository: iVIdeoRepository) {
            this.video_repository = videoRepository;
      }

      public async createVideo(req: CustomRequest): Promise<CreateVideoDTO | unknown> {
            const { file_name } = await uploadFile(req, "videos");
            let video_name = request_utils.extractParamFromRequest(req, "name");

            const existing_video = await this.video_repository.getVideoByName(video_name);
            if(existing_video) {
                  video_name = existing_video.name + '_2';
            }

            const action_id = request_utils.extractParamFromRequest(req, "action_id");
            const playlist_id = request_utils.extractParamFromRequest(req, "playlist_id");
            const creator_id = request_utils.extractParamFromRequest(req, "creator_id");
            const tagId_array = request_utils.extractParamFromRequest(req, "tag_ids");
            const film_id = request_utils.extractParamFromRequest(req, "film_id");
            const code_id = request_utils.extractParamFromRequest(req, "code_id");
            const studio_id = request_utils.extractParamFromRequest(req, "studio_id");
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
}
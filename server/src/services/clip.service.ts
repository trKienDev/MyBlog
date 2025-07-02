import { ClipDTO, CreateClipDTO } from "../dtos/clip.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { iClipRepository } from "../repositories/interfaces/iclip.repository.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class ClipService {
      private _clipRepository: iClipRepository;
      constructor(clipReposiotry: iClipRepository) {
            this._clipRepository = clipReposiotry;
      }

      async CreateClip(request: CustomRequest): Promise<ClipDTO> {
            const { file_name } = await file_utils.uploadFile(request, UploadFiles.CLIPS);
            let clip_name = request_utils.extractParamFromRequest(request, "clip_name");
            const action_id = request_utils.extractParamFromRequest(request, "action_id");
            const record_id = request_utils.extractParamFromRequest(request, "record_id");
            const code_id = request_utils.extractParamFromRequest(request, "code_id");
            const studio_id = request_utils.extractParamFromRequest(request, "studio_id");
            const creator_id = request_utils.extractParamFromRequest(request, "creator_id");
            const idol_id = request_utils.extractParamFromRequest(request, "idol_id");
            const tagId_array = request_utils.extractParamFromRequest(request, "tag_ids");
            const tag_ids: string[] = tagId_array.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

            const new_clip: CreateClipDTO = {
                  name: clip_name,
                  record_id: record_id,
                  action_id: action_id,
                  file_path: file_name,
            };
            if(code_id) new_clip.code_id = code_id;
            if(studio_id) new_clip.studio_id = studio_id;
            if(creator_id) new_clip.creator_id = creator_id;
            if(idol_id) new_clip.idol_id = idol_id;
            if(tag_ids && tag_ids.length > 0) new_clip.tag_ids = tag_ids;
            
            return await this._clipRepository.Create(new_clip);
      }
}
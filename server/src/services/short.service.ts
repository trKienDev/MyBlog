import { CreateShortDTO, ShortDTO } from "../dtos/short.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { iShortRepository } from "../repository/interfaces/ishort.repository.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class ShortService {
      private _shortRepository: iShortRepository;
      constructor(shortRepository: iShortRepository) {
            this._shortRepository = shortRepository;
      }

      async CreateShort(request: CustomRequest): Promise<ShortDTO> {
            const { file_name } = await file_utils.uploadFile(request, UploadFiles.SHORTS);
            const new_short: CreateShortDTO = {
                  file_path: file_name,
            };

            const idol_id = request_utils.extractParamFromRequest(request, "idol_id");
            if(idol_id) {
                  new_short.idol_id = idol_id
            };

            const tagId_array = request_utils.extractParamFromRequest(request, "tag_ids");
            const tag_ids: string[] = tagId_array.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            if(tag_ids) {
                  new_short.tag_ids = tag_ids
            }

            return await this._shortRepository.CreateShort(new_short);
      }
}
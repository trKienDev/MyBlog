import { CreateShortDTO, iShortPaginatedFilters, ShortDTO } from "../dtos/short.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { iShort } from "../models/interface/ishort.model.js";
import { iShortRepository } from "../repositories/interfaces/ishort.repository.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class ShortService {
      private _shortRepository: iShortRepository;
      constructor(shortRepository: iShortRepository) {
            this._shortRepository = shortRepository;
      }
      
      async GetPaginatedShorts(page: number, limit: number, filters: iShortPaginatedFilters) {
            const { shorts, total } = await this._shortRepository.GetPaginatedShorts(page, limit, filters);
            const paginated_shorts = shorts.map(doc => MappingDocToDTO(doc));
            return {
                  shorts: paginated_shorts,
                  pagigation: {
                        page: page,
                        limit: limit,
                        total: total
                  }
            }
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

            return await this._shortRepository.Create(new_short);
      }
}

function MappingDocToDTO(doc: iShort): ShortDTO {
      return {
            _id: doc._id.toString(),
            idol_id: doc?.idol_id?.toString(),
            tag_ids: doc.tag_ids?.map(id => id.toString()) ?? [],
            file_path: doc.file_path,
            views: doc.views,
            likes: doc.likes,
      }
}
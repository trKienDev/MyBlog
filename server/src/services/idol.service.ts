import { IdolDTO } from "../dtos/idol.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { iIdolRepository } from "../repository/interfaces/iIdol.repository.js";
import { FileService } from "../utils/file.service.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class IdolService {
      private _idolRepository: iIdolRepository;
      constructor(idolRepository: iIdolRepository) {
            this._idolRepository = idolRepository;
      }

      async CreateIdol(request: CustomRequest) {
            const { file_name } = await file_utils.uploadFile(request, UploadFiles.IDOLS);
            const idol_name = request_utils.extractParamFromRequest(request, "name");
            const idol_region = request_utils.extractParamFromRequest(request, "region");
            const identifier_name = request_utils.extractParamFromRequest(request, "identifier_name");

            const existing_idol = await this._idolRepository.FindByName(idol_name);

            if(existing_idol) {
                  FileService.deleteFile(UploadFiles.IDOLS, file_name);
                  throw new Error('idol existed');
            }
            const data: IdolDTO = {
                  name: idol_name,
                  identifier_name: identifier_name,
                  avatar_url: file_name,
            };
            if(idol_region) {
                  data.region = idol_region
            }
            console.log('data: ', data);
            const new_idol = await this._idolRepository.Create(data);
            return new_idol;
      }
}
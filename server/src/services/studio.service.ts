import { StudioDTO } from "../dtos/studio.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";
import { UploadFiles } from "../enums.js";
import { IncomingMessage } from "http";
import { parseJSON } from "../middlewares/json-parser.js";
import { iStudioRepository } from "../repositories/interfaces/istudio.repository.js";

export class StudioService {
      private _studioRepository: iStudioRepository;
      constructor(studioRepository: iStudioRepository) {
            this._studioRepository = studioRepository;
      }

      public async findStudioById(id: string): Promise<StudioDTO> {
            const studio = await this._studioRepository.findStudioById(id);
            if(!studio) {
                  throw new Error("Studio not found.");
            } 
            return studio;
      }
      
      public async CreateStudio(request: IncomingMessage): Promise<StudioDTO> {
            const require_param = ['name'];
            const request_body = await parseJSON(request, require_param);
            const { name } = request_body;

            const existing_studio = await this._studioRepository.findStudioByName(name);
            if(existing_studio) {
                  throw new Error('Studio with this name has already existed.');
            }
      
            const new_studio = await this._studioRepository.createStudio(name);
            return new_studio;
      }

      public async updateStudio(request: CustomRequest, id: string): Promise<StudioDTO> {
            const currentStudio = await this.findStudioById(id);
            if(!currentStudio) {
                  throw new Error("Studio not found");
            }

            const { file_name } = await file_utils.uploadFile(request, UploadFiles.STUDIOS);
            const name = request_utils.extractParamFromRequest(request, "name");
            const updateData: Record<string, any> = { name };

            const updatedStudio = await this._studioRepository.updateStudio(id, updateData);
            if(!updatedStudio) {
                  throw new Error("Studio updated failed.");
            }

            return updatedStudio;
      }

      public async DeleteStudio(id: string): Promise<void> {
            const studio = await this.findStudioById(id);
            await this._studioRepository.deleteStudioById(id);
      }
}
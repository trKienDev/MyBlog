import { StudioDTO } from "../dtos/studio.dto.js";
import { IStudioRepository } from "../repository/interfaces/istudio.repository.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";
import { UploadFiles } from "../enums.js";
import { IncomingMessage } from "http";
import { parseJSON } from "../middlewares/json-parser.js";

export class StudioService {
      private studioRepo: IStudioRepository;
      constructor(studioRepository: IStudioRepository) {
            this.studioRepo = studioRepository;
      }

      public async findStudioById(id: string): Promise<StudioDTO> {
            const studio = await this.studioRepo.findStudioById(id);
            if(!studio) {
                  throw new Error("Studio not found.");
            } 
            return studio;
      }
      
      public async CreateStudio(request: IncomingMessage): Promise<StudioDTO> {
            const require_param = ['name'];
            const request_body = await parseJSON(request, require_param);
            const { name } = request_body;

            const existing_studio = await this.studioRepo.findStudioByName(name);
            if(existing_studio) {
                  throw new Error('Studio with this name has already existed.');
            }
      
            const new_studio = await this.studioRepo.createStudio(name);
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

            const updatedStudio = await this.studioRepo.updateStudio(id, updateData);
            if(!updatedStudio) {
                  throw new Error("Studio updated failed.");
            }

            return updatedStudio;
      }

      public async DeleteStudio(id: string): Promise<void> {
            const studio = await this.findStudioById(id);
            await this.studioRepo.deleteStudioById(id);
      }
}
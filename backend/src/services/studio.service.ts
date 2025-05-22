import { StudioDTO } from "../dtos/studio.dto.js";
import { IStudioRepository } from "../repository/interfaces/istudio.repository.js";
import { FileService } from "../utils/file.service.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import file_utils from "../utils/file.utils.js";

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
      
      public async createStudio(req: CustomRequest): Promise<StudioDTO> {
            const { name, file_name } = await file_utils.uploadFile(req, "studio");
            const existingStudio = await this.studioRepo.findStudioByName(name);
            if(existingStudio) {
                  throw new Error('Studio with this name has already existed.');
            }
      
            const newStudio = await this.studioRepo.createStudio(name, file_name);
            return newStudio;
      }

      public async updateStudio(req: CustomRequest, id: string): Promise<StudioDTO> {
            const currentStudio = await this.findStudioById(id);
            if(!currentStudio) {
                  throw new Error("Studio not found");
            }

            const { name, file_name } = await file_utils.uploadFile(req, "studio");
            const updateData: Record<string, any> = { name };
            
            if(file_name) {
                  FileService.deleteFile("studio", currentStudio.image);
                  updateData.image = file_name
            }

            const updatedStudio = await this.studioRepo.updateStudio(id, updateData);
            if(!updatedStudio) {
                  throw new Error("Studio updated failed.");
            }

            return updatedStudio;
      }

      public async DeleteStudio(id: string): Promise<void> {
            const studio = await this.findStudioById(id);
            if(studio.image) {
                  await FileService.deleteFile("studio", studio.image);
            }

            await this.studioRepo.deleteStudioById(id);
      }
}
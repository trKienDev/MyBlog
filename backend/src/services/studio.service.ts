import { StudioDTO } from "../dtos/studio.dto.js";
import { IStudioRepository } from "../repository/interfaces/istudio.repository.js";
import { FileService } from "../utils/file.service.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { UploadFile } from "../utils/file.utils.js";

export class StudioService {
      private studioRepo: IStudioRepository;
      constructor(studioRepository: IStudioRepository) {
            this.studioRepo = studioRepository;
      }

      public async FindStudioById(id: string): Promise<StudioDTO> {
            const studio = await this.studioRepo.FindStudioById(id);
            if(!studio) {
                  throw new Error("Studio not found.");
            } 
            return studio;
      }
      
      public async GetStudios() {
            return this.studioRepo.FindStudios();
      }

      public async CreateStudio(req: CustomRequest): Promise<StudioDTO> {
            const { name, imgName } = await UploadFile(req, "studio");
            const existingStudio = await this.studioRepo.FindStudioByName(name);
            if(existingStudio) {
                  throw new Error('Studio with this name has already existed.');
            }
      
            const newStudio = await this.studioRepo.CreateStudio(name, imgName);
            return newStudio;
      }

      public async UpdateStudio(req: CustomRequest, id: string): Promise<StudioDTO> {
            const currentStudio = await this.FindStudioById(id);
            if(!currentStudio) {
                  throw new Error("Studio not found");
            }

            const { name, imgName } = await UploadFile(req, "studio");
            const updateData: Record<string, any> = { name };
            
            if(imgName) {
                  FileService.DeleteFile("studio", currentStudio.image);
                  updateData.image = imgName
            }

            const updatedStudio = await this.studioRepo.UpdateStudio(id, updateData);
            if(!updatedStudio) {
                  throw new Error("Studio updated failed.");
            }

            return updatedStudio;
      }

      public async DeleteStudio(id: string): Promise<void> {
            const studio = await this.FindStudioById(id);
            if(studio.image) {
                  await FileService.DeleteFile("studio", studio.image);
            }

            await this.studioRepo.DeleteStudioById(id);
      }
}
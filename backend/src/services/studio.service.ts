// studio.service chỉ tập trung xử lý nghiệp vụ liên quan đến studio=
import fs from "fs";
import path from "path";
import { StudioDTO } from "../dtos/studio.dto.js";
import { IStudioRepository } from "../repository/istudio.repository.js";
import { FileService } from "../utils/file.service.js";

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
      
      public async GetAllStudios() {
            return this.studioRepo.FindAllStudios();
      }

      public async CreateStudio(name: string, imgName: string): Promise<StudioDTO> {
            const existingStudio = await this.studioRepo.FindStudioByName(name);
            if(existingStudio) {
                  throw new Error('Studio with this name has already existed.');
            }
      
            const newStudio = await this.studioRepo.CreateStudio(name, imgName);
            return newStudio;
      }

      public async UpdateStudio(id: string, updateData: Partial<StudioDTO>): Promise<StudioDTO> {
            const currentStudio = await this.FindStudioById(id);

            if(updateData.image !== undefined && updateData.image !== '' && updateData.image !== currentStudio.image && currentStudio.image) {
                  FileService.DeleteFile("studio", currentStudio.image);
            }

            const mergedUpdateData: Partial<StudioDTO> = {
                  name: updateData.name === '' || updateData.name === undefined
                        ? currentStudio.name
                        : updateData.name,
                  image: updateData.image === '' || updateData.image === undefined
                        ? currentStudio.image
                        : updateData.image,
            };

            const updatedStudio = await this.studioRepo.UpdateStudio(id, mergedUpdateData);
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
import { CreatorDTO } from "../dtos/creator.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ICreatorRepository } from "../repository/interfaces/icreator.repository.js";
import { FileService } from "../utils/file.service.js";
import file_utils from "../utils/file.utils.js";

export class CreatorService {
      private creatorRepo: ICreatorRepository;
      constructor(creatorRepository: ICreatorRepository) {
            this.creatorRepo = creatorRepository;
      }

      public async FindCreatorById(id: string): Promise<CreatorDTO> {
            const creator = await this.creatorRepo.findById(id);
            if(!creator) { 
                  throw new Error("Creator not found.");
            }
            
            return creator;
      }

      async CreateCreator(req: CustomRequest) {
            const { file_name } = await file_utils.uploadFile(req, UploadFiles.CREATOR_AVATARS);
            const { name, birth } = req.body;
            const existingCreator = await this.creatorRepo.FindByNameAndBirth(name, birth);
            if(existingCreator) {
                  return { success: false, code: 409, message: 'Creator has already existed' };
            }

            const data: CreatorDTO = {
                  name,
                  birth: new Date(birth),
                  image: file_name
            };
            
            const newCreator = await this.creatorRepo.Create(data);
            return newCreator;
      }

      public async UpdateCreator(req: CustomRequest, id: string): Promise<CreatorDTO> {
            const currentCreator = await this.creatorRepo.findById(id);
            if(!currentCreator) {
                  throw new Error("Creator not found!");
            }

            const { file_name } = await file_utils.uploadFile(req, UploadFiles.CREATOR_AVATARS);
            const { name, birth } = req.body;
            const updateData: Record<string, any> = { name, birth };

            if(file_name) {
                  FileService.deleteFile(UploadFiles.CREATOR_AVATARS, currentCreator.image);
                  updateData.image = file_name;
            }

            const updatedCreator = await this.creatorRepo.UpdateCreator(id, updateData);
            if(!updatedCreator) {
                  throw new Error("Error updating creator.");
            }

            return updatedCreator;
      }

      public async DeleteCreator(id: string): Promise<CreatorDTO> {
            const studio = await this.FindCreatorById(id);
            if(!studio.image) {
                  await FileService.deleteFile("creator/avatar", studio.image);
            }

            return this.creatorRepo.Delete(id);
      }
}
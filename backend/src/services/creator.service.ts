import { CreatorDTO } from "../dtos/creator.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ICreatorRepository } from "../repository/icreator.repository.js";
import { FileService } from "../utils/file.service.js";
import { UploadFile } from "../utils/file.utils.js";

export class CreatorService {
      private creatorRepo: ICreatorRepository;
      constructor(creatorRepository: ICreatorRepository) {
            this.creatorRepo = creatorRepository;
      }

      public async FindCreatorById(id: string): Promise<CreatorDTO> {
            const creator = await this.creatorRepo.FindById(id);
            if(!creator) { 
                  throw new Error("Studio not found.");
            }
            
            return creator;
      }

      async CreateCreator(data: CreatorDTO) {
            const { name, birth } = data;
            
            const existingCreator = await this.creatorRepo.FindByNameAndBirth(name, birth);
            if(existingCreator) {
                  return { success: false, code: 409, message: 'Creator has already existed' };
            }

            const newCreator = await this.creatorRepo.Create(data);
            return { success: true, code: 201, data: newCreator };
      }

      public async UpdateCreator(req: CustomRequest, id: string): Promise<CreatorDTO> {
            const currentCreator = await this.creatorRepo.FindById(id);
            if(!currentCreator) {
                  throw new Error("Creator not found!");
            }

            const { imgName } = await UploadFile(req, "creator/avatar");
            const { name, birth, skin, studio, breast, body } = req.body;
            const updateData: Record<string, any> = { name, birth, skin, studio, body, breast };

            if(imgName) {
                  FileService.DeleteFile("creator/avatar", currentCreator.image);
                  updateData.image = imgName;
            }

            const updatedCreator = await this.creatorRepo.UpdateCreator(id, updateData);
            if(!updatedCreator) {
                  throw new Error("Creator not found after updated.");
            }

            return updatedCreator;
      }
}
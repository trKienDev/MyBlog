import { CreatorDTO } from "../dtos/creator.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ICreatorRepository } from "../repository/interfaces/icreator.repository.js";
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

      async CreateCreator(req: CustomRequest) {
            const { imgName } = await UploadFile(req, "creator/avatar");
            const { name, birth, skin, studio, body, breast } = req.body;
            const existingCreator = await this.creatorRepo.FindByNameAndBirth(name, birth);
            if(existingCreator) {
                  return { success: false, code: 409, message: 'Creator has already existed' };
            }

            const data: CreatorDTO = {
                  name,
                  birth: new Date(birth),
                  skin,
                  studio,
                  body,
                  breast,
                  image: imgName
            };
            
            const newCreator = await this.creatorRepo.Create(data);
            return newCreator;
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

      public async DeleteCreator(id: string): Promise<CreatorDTO> {
            const studio = await this.FindCreatorById(id);
            if(!studio.image) {
                  await FileService.DeleteFile("creator/avatar", studio.image);
            }

            return this.creatorRepo.Delete(id);
      }
}
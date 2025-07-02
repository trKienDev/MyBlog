import { CreatorDTO } from "../dtos/creator.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { iCreatorRepository } from "../repositories/interfaces/icreator.repository.js";
import { FileService } from "../utils/file.service.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class CreatorService {
      private creatorRepo: iCreatorRepository;
      constructor(creatorRepository: iCreatorRepository) {
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
            const creator_name = request_utils.extractParamFromRequest(req, "name");

            const creator_birth = request_utils.extractParamFromRequest(req, "birth");
            const formated_creatorBirth = new Date(creator_birth);
            
            const creator_views = request_utils.extractParamFromRequest(req, "views");
            const formated_creatorViews: number = Number(creator_views);

            const creattor_active = request_utils.extractParamFromRequest(req, "status");
            let isCreatorActive: boolean;
            if(creattor_active === 'active') {
                  isCreatorActive = true;
            } else {
                  isCreatorActive = false;
            }

            const tags_param = request_utils.extractParamFromRequest(req, "tag_ids");
            const creator_tags: string[] = tags_param.split(',').map((string) => string.trim()).filter((string) => string.length > 0);

            const existingCreator = await this.creatorRepo.FindByNameAndBirth(creator_name, formated_creatorBirth);
            if(existingCreator) {
                  return { success: false, code: 409, message: 'Creator has already existed' };
            }
            const creator_identifierName = await createCreatorIdentifierName(creator_name);
            const data: CreatorDTO = {
                  name: creator_name,
                  identifier_name: creator_identifierName,
                  birth: formated_creatorBirth,
                  image: file_name,
                  active: isCreatorActive,
                  views: formated_creatorViews,
                  tag_ids: creator_tags,
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
            const creator_name = request_utils.extractParamFromRequest(req, "name");

            const identifier_name = await createCreatorIdentifierName(creator_name);
            const creator_birth = request_utils.extractParamFromRequest(req, "birth");

            const formated_creatorBirth = new Date(creator_birth);
            const updateData: Partial<CreatorDTO> = { 
                  name: creator_name, 
                  identifier_name: identifier_name, 
                  birth: formated_creatorBirth 
            };

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

async function createCreatorIdentifierName(creator_name: string): Promise<string> {
      const lowercased_name = creator_name.toLowerCase();
      const noSpaces_name = lowercased_name.replace(/\s/g, '');
      const identifier_name = `@${noSpaces_name}`;

      return identifier_name;
}
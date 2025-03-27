// studio.service chỉ tập trung xử lý nghiệp vụ liên quan đến studio=
import { StudioDTO } from "../interfaces/studio.dto.js";
import { IStudioRepository } from "../repository/istudio.repository.js";

export class StudioService {
      private studioRepo: IStudioRepository;

      constructor(studioRepository: IStudioRepository) {
            this.studioRepo = studioRepository;
      }

      async GetAllStudios() {
            return this.studioRepo.FindAllStudios();
      }

      async CreateStudio(name: string, imgName: string): Promise<StudioDTO> {
            const existingStudio = await this.studioRepo.FindStudioByName(name);
            if(existingStudio) {
                  throw new Error('Studio with this name has already existed.');
            }
      
            const newStudio = await this.studioRepo.CreateStudio(name, imgName);
            return newStudio;
      }
}
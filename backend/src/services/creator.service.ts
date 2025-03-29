import { ICreatorRepository } from "../repository/icreator.repository";

export class CreatorService {
      private repository: ICreatorRepository;
      constructor(repository: ICreatorRepository) {
            this.repository = repository;
      }

      async CreateCreator(data: any) {
            const { name, birth } = data;
            
            const existingCreator = await this.repository.FindByNameAndBirth(name, birth);
            if(existingCreator) {
                  return { success: false, code: 409, message: 'Creator has already existed' };
            }

            const newCreator = await this.repository.Create(data);
            return { success: true, code: 201, data: newCreator };
      }
}
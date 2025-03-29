import { CreatorDTO } from "../dtos/creator.dto";

export interface ICreatorRepository {
      FindByNameAndBirth(name: string, birth: Date): Promise<CreatorDTO | null>;
      Create(data: any): Promise<any>;
}
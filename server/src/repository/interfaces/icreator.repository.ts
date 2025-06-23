import { CreatorDTO } from "../../dtos/creator.dto";

export interface ICreatorRepository {
      GetCreators(): Promise<CreatorDTO[] | null>;
      findById(id: string): Promise<CreatorDTO | null>;
      FindByNameAndBirth(name: string, birth: Date): Promise<CreatorDTO | null>;
      FindByTagId(tag_id: string): Promise<CreatorDTO[]>;
      Create(data: CreatorDTO): Promise<CreatorDTO>;
      UpdateCreator(id: string, data: Partial<CreatorDTO>): Promise<CreatorDTO>;
      Delete(id: string): Promise<CreatorDTO>;
}
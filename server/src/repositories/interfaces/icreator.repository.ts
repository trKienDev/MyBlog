import { CreatorDTO, CreatorsPaginationDTO, FilterCreatorsPagination } from "../../dtos/creator.dto.js";

export interface iCreatorRepository {
      GetCreators(): Promise<CreatorDTO[] | null>;
      findRandomizePaginated(page: number, limit: number, filters: FilterCreatorsPagination, seed: string): Promise<CreatorsPaginationDTO>;
      findById(id: string): Promise<CreatorDTO | null>;
      FindByNameAndBirth(name: string, birth: Date): Promise<CreatorDTO | null>;
      FindByTagId(tag_id: string): Promise<CreatorDTO[]>;
      Create(data: CreatorDTO): Promise<CreatorDTO>;
      UpdateCreator(id: string, data: Partial<CreatorDTO>): Promise<CreatorDTO>;
      Delete(id: string): Promise<CreatorDTO>;
}
import { FilterIdolPagination, IdolDTO, IdolsPaginationDTO } from "../../dtos/idol.dto.js";

export interface iIdolRepository {
      Create(data: IdolDTO): Promise<IdolDTO>
      FindByName(name: string): Promise<IdolDTO | null>
      findRandomizePaginated(page: number, limit: number, filters: FilterIdolPagination, seed: string): Promise<IdolsPaginationDTO>;
      findById(id: string): Promise<IdolDTO | null>;
}
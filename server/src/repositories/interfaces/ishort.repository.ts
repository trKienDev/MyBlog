import { CreateShortDTO, FiltersShortPagination, ShortDTO, ShortPaginationDto } from "../../dtos/short.dto.js";

export interface iShortRepository {
      GetAll(): Promise<ShortDTO[]>;
      GetPaginatedShorts(page: number, limit: number, filter: FiltersShortPagination): Promise<ShortPaginationDto>;
      Create(data: CreateShortDTO): Promise<ShortDTO>;
       findRandomizePaginated(page: number, limit: number, filters: FiltersShortPagination, seed: string): Promise<ShortPaginationDto>
}
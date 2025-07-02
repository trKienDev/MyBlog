import { CreateShortDTO, iPaginatedShortDto, iShortPaginatedFilters, ShortDTO } from "../../dtos/short.dto.js";

export interface iShortRepository {
      GetAll(): Promise<ShortDTO[]>;
      GetPaginatedShorts(page: number, limit: number, filter: iShortPaginatedFilters): Promise<iPaginatedShortDto>;
      Create(data: CreateShortDTO): Promise<ShortDTO>;
}
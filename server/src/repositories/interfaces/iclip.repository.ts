import { ClipDTO, ClipPaginationDto, CreateClipDTO, FiltersClipPagination } from "../../dtos/clip.dto.js";

export interface iClipRepository {
      FindAll(): Promise<ClipDTO[]>;
      findRandomizePaginated(page: number, limit: number, filters: FiltersClipPagination, seed: string): Promise<ClipPaginationDto>;
      Create(data: CreateClipDTO): Promise<ClipDTO>;
}
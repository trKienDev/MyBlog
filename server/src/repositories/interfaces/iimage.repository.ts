import { FilterImagesPagination, ImageDTO, ImagesPaginationDTO } from "../../dtos/image.dto.js";
import { FilterMangaPagination, MangasPaginationDTO } from "../../dtos/manga.dto.js";

export interface iImageRepository {
      GetAll(): Promise<ImageDTO[]>;
      Create(data: Partial<ImageDTO>): Promise<Partial<ImageDTO>>;
      GetImagesPagination(page: number, limit: number, filters: FilterImagesPagination): Promise<ImagesPaginationDTO>;
      findRandomizePaginated(page: number, limit: number, filters: FilterMangaPagination, seed: string): Promise<ImagesPaginationDTO>
}
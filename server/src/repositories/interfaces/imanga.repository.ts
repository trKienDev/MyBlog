import { FilterMangaPagination, InitialMangaDTO, ListImagesMangaDTO, MangaDTO, MangasPaginationDTO } from "../../dtos/manga.dto.js";

export interface iMangaRepository {
      getMangas(): Promise<MangaDTO[]>;
      findMangaById(id: string): Promise<MangaDTO | null>;
      findMangaByName(name: string): Promise<MangaDTO | null>;
      findRandomizePaginated(page: number, limit: number, filters: FilterMangaPagination, seed: string): Promise<MangasPaginationDTO>
      initialManga(data: InitialMangaDTO): Promise<InitialMangaDTO>;
      updateImageListToManga(id: string, data: ListImagesMangaDTO): Promise<MangaDTO>;
}
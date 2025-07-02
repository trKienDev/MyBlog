import { InitialMangaDTO, ListImagesMangaDTO, MangaDTO } from "../../dtos/manga.dto.js";

export interface iMangaRepository {
      getMangas(): Promise<MangaDTO[]>;
      findMangaById(id: string): Promise<MangaDTO | null>;
      findMangaByName(name: string): Promise<MangaDTO | null>;
      initialManga(data: InitialMangaDTO): Promise<InitialMangaDTO>;
      updateImageListToManga(id: string, data: ListImagesMangaDTO): Promise<MangaDTO>;
}
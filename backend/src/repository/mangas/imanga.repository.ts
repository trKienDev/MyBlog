import { InitialMangaDTO, ListImagesMangaDTO, MangaDTO } from "../../dtos/mangas/manga.dto.js";

export interface iMangaRepository {
      getMangas(): Promise<MangaDTO[]>;
      findMangaByName(name: string): Promise<MangaDTO | null>;
      initialManga(data: InitialMangaDTO): Promise<InitialMangaDTO>;
      updateImageListToManga(data: ListImagesMangaDTO): Promise<MangaDTO>;
}
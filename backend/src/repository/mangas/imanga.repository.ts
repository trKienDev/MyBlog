import { CreateMangaDTO, MangaDTO } from "../../dtos/mangas/manga.dto";

export interface iMangaRepository {
      getMangas(): Promise<MangaDTO[]>;
      findMangaByName(name: string): Promise<MangaDTO | null>;
      createManga(data: CreateMangaDTO): Promise<CreateMangaDTO>;
}
import { MangaDTO } from "../../dtos/mangas/manga.dto";

export interface iMangaRepository {
      createManga(data: MangaDTO): Promise<MangaDTO>;
}
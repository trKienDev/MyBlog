import { MangaTagDTO } from "../../dtos/mangas/manga-tag.dto";

export interface iMangaTagRepository {
      getMangaTags(): Promise<MangaTagDTO[]>;
      findMangaTagByTag(tag: string): Promise<MangaTagDTO | null>;
      createMangaTag(data: MangaTagDTO): Promise<MangaTagDTO>;
}
import { AnimeTagDTO } from "../../../dtos/anime-tag.dto.js";

export interface iAnimeTagRepository {
      getAnimeTags(): Promise<AnimeTagDTO[]>;
      getAnimeTagById(id: string): Promise<AnimeTagDTO | null>;
      getAnimeTagByAction(): Promise<AnimeTagDTO[]>;
      getAnimeTagsByFilm(): Promise<AnimeTagDTO[]>;
      getAnimeVideoTags(): Promise<AnimeTagDTO[]>;
      createAnimeTag(data: AnimeTagDTO): Promise<AnimeTagDTO>;
}
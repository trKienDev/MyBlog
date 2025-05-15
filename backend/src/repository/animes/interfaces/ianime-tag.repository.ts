import { AnimeTagDTO } from "../../../dtos/animes/anime-tag.dto.js";

export interface iAnimeTagRepository {
      getAnimeTags(): Promise<AnimeTagDTO[]>;
      getAnimeTagById(id: string): Promise<AnimeTagDTO | null>;
      getAnimeTagsByFilm(): Promise<AnimeTagDTO[]>;
      createAnimeTag(data: AnimeTagDTO): Promise<AnimeTagDTO>;
}
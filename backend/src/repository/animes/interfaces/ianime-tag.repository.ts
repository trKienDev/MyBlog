import { AnimeTagDTO } from "../../../dtos/animes/anime-tag.dto.js";

export interface iAnimeTagRepository {
      getAnimeTags(): Promise<AnimeTagDTO[]>;
      createAnimeTag(data: AnimeTagDTO): Promise<AnimeTagDTO>;
}
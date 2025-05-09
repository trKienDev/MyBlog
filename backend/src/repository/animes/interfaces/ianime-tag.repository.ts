import { AnimeTagDTO } from "../../../dtos/animes/anime-tag.dto.js";

export interface iAnimeTagRepository {
      createAnimeTag(data: AnimeTagDTO): Promise<AnimeTagDTO>;
}
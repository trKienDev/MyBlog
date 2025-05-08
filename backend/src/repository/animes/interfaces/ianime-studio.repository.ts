import { AnimeStudioDTO } from "../../../dtos/animes/anime-studio.dto.js";

export interface IAnimeStudioRepository {
      getAnimeStudios(): Promise<AnimeStudioDTO[]>;
      createAnimeStudio(name: string): Promise<AnimeStudioDTO>;
}
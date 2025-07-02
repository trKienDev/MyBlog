import { AnimeStudioDTO } from "../../dtos/anime-studio.dto.js";

export interface IAnimeStudioRepository {
      getAnimeStudios(): Promise<AnimeStudioDTO[]>;
      findById(id: string): Promise<AnimeStudioDTO | null>;
      createAnimeStudio(name: string): Promise<AnimeStudioDTO>;
}
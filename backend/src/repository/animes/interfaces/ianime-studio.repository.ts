import { AnimeFilmDTO } from "../../../dtos/animes/anime-film.dto.js";
import { AnimeStudioDTO } from "../../../dtos/animes/anime-studio.dto.js";

export interface IAnimeStudioRepository {
      getAnimeStudios(): Promise<AnimeStudioDTO[]>;
      findById(id: string): Promise<AnimeStudioDTO | null>;
      createAnimeStudio(name: string): Promise<AnimeStudioDTO>;
}
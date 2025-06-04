import { AnimeSeriesDTO } from "../../../dtos/animes/anime-series.dto.js";

export interface IAnimeSeriesRepository {
      getAnimeSeriesById(id: string): Promise<AnimeSeriesDTO | null>;
      getAnimeSeries(): Promise<AnimeSeriesDTO[]>;
      createAnimeSeries(name: string): Promise<AnimeSeriesDTO>;
}
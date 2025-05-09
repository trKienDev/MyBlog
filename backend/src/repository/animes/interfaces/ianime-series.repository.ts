import { AnimeSeriesDTO } from "../../../dtos/animes/anime-series.dto.js";

export interface IAnimeSeriesRepository {
      getAnimeSeries(): Promise<AnimeSeriesDTO[]>;
      createAnimeSeries(name: string): Promise<AnimeSeriesDTO>;
}
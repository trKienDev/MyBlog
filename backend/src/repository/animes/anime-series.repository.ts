import { AnimeSeriesDTO } from "../../dtos/animes/anime-series.dto.js";
import AnimeSeries, { IAnimeSeries } from "../../models/animes/anime-series.model.js";
import { IAnimeSeriesRepository } from "./interfaces/ianime-series.repository.js";

export class AnimeSeriesRepository implements IAnimeSeriesRepository {
      async getAnimeSeriesById(id: string): Promise<AnimeSeriesDTO | null> {
            const series = await AnimeSeries.findById(id);
            return series ? mappingDocToDTO(series) : null;
      }

      async getAnimeSeries(): Promise<AnimeSeriesDTO[]> {
            const anime_series = await AnimeSeries.find();
            return anime_series.map(anime_series => mappingDocToDTO(anime_series));
      }
      
      async createAnimeSeries(data: string): Promise<AnimeSeriesDTO> {
            const anime_series = new AnimeSeries({ name: data });
            const created_animeSeries = await anime_series.save();
            return mappingDocToDTO(created_animeSeries);
      }
}

function mappingDocToDTO(doc: IAnimeSeries): AnimeSeriesDTO {
      return {
            _id: doc.id.toString(),
            name: doc.name,
      }
}
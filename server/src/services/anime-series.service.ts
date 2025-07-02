import { IncomingMessage } from "http";
import { IAnimeSeriesRepository } from "../repositories/interfaces/ianime-series.repository.js";
import { parseJSON } from "../middlewares/json-parser.js";

export class AnimeSeriesService {
      private animSeries_repository: IAnimeSeriesRepository;            
      constructor(AnimeSeriesRepository: IAnimeSeriesRepository) {
            this.animSeries_repository = AnimeSeriesRepository;
      }

      async createAnimeSeries(request: IncomingMessage) {
            const required_params = ['name'];
            const body = await parseJSON(request, required_params);
            const { name } = body;
            if(!name) {
                  throw new Error('param name in createAnimeSeries not found');
            }

            const new_animeSeries = await this.animSeries_repository.createAnimeSeries(name);
            return new_animeSeries;
      }
}
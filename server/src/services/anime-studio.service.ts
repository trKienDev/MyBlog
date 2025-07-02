import { IncomingMessage } from "http";
import { IAnimeStudioRepository } from "../repositories/interfaces/ianime-studio.repository.js";
import { parseJSON } from "../middlewares/json-parser.js";

export class AnimeStudioService {
      private _animeStudioRepository: IAnimeStudioRepository;
      constructor(AnimeStudioRepository: IAnimeStudioRepository) {
            this._animeStudioRepository = AnimeStudioRepository;
      }

      async createAnimeStudio(request: IncomingMessage) {
            const required_params = ['name'];
            const body = await parseJSON(request, required_params);
            const { name } = body;
            if(!name) {
                  throw new Error('param name in createAnimeStudio not found');
            }

            const new_animeStudio = await this._animeStudioRepository.createAnimeStudio(name);
            return new_animeStudio;
      }
}
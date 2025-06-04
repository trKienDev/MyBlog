import { IncomingMessage } from "http";
import { IAnimeStudioRepository } from "../../repository/animes/interfaces/ianime-studio.repository.js";
import { parseJSON } from "../../middlewares/json-parser.js";

export class AnimeStudioService {
      private animeStudio_repository: IAnimeStudioRepository;
      constructor(AnimeStudioRepository: IAnimeStudioRepository) {
            this.animeStudio_repository = AnimeStudioRepository;
      }

      async createAnimeStudio(req: IncomingMessage) {
            const required_params = ['name'];
            const body = await parseJSON(req, required_params);
            const { name } = body;
            if(!name) {
                  throw new Error('param name in createAnimeStudio not found');
            }

            const new_animeStudio = await this.animeStudio_repository.createAnimeStudio(name);
            return new_animeStudio;
      }
}
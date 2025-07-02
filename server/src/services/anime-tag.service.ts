import { IncomingMessage } from "http";
import { iAnimeTagRepository } from "../../repository/interfaces/ianime-tag.repository.js";
import { parseJSON } from "../../middlewares/json-parser.js";
import { AnimeTagDTO } from "../../dtos/anime-tag.dto.js";

export class AnimeTagService {
      private animeTag_repository: iAnimeTagRepository;
      constructor(animeTagRepository: iAnimeTagRepository) {
            this.animeTag_repository = animeTagRepository;
      }

      public async createAnimeTag(req: IncomingMessage) {
            const required_params = ['name', 'kind'];
            const body = await parseJSON(req, required_params);
            const { name, kind } = body; 
            if (!name || !kind ) {
                  throw new Error('Missing required information');
            }

            const data: AnimeTagDTO = { name, kind };
            
            const new_animeTag = await this.animeTag_repository.createAnimeTag(data);
            return new_animeTag;
      }
}
import { IncomingMessage } from "http";
import { iMangaTagRepository } from "../../repository/mangas/imanga-tag.repository.js";
import { MangaTagDTO } from "../../dtos/mangas/manga-tag.dto.js";
import { parseJSON } from "../../middlewares/json-parser.js";

export class MangaTagService {
      private mangaTagRepository: iMangaTagRepository;
      constructor(MangaTagRepo: iMangaTagRepository) {
            this.mangaTagRepository = MangaTagRepo;
      }

      async createMangaTag(req: IncomingMessage): Promise<MangaTagDTO> {
            const required_fields = ['tag'];
            const body = await parseJSON(req, required_fields);
            const {tag} = body;
            if(!tag) {
                  throw new Error('Missing tag in request');
            }

            const existed_mangaTag = await this.mangaTagRepository.findMangaTagByTag(tag);
            if(existed_mangaTag) {
                  throw new Error('This manga tag has been existed');
            }

            const data: MangaTagDTO = { tag };
            const created_animeTag = await this.mangaTagRepository.createMangaTag(data);
            return created_animeTag;
      }
}
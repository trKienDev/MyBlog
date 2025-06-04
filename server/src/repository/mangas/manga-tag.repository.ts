import { MangaTagDTO } from "../../dtos/mangas/manga-tag.dto.js";
import MangaTag, { iMangaTag } from "../../models/mangas/manga-tag.model.js";
import { iMangaTagRepository } from "./imanga-tag.repository.js";

export class MangaTagRepository implements iMangaTagRepository {
      async getMangaTags(): Promise<MangaTagDTO[]> {
            const manga_tags = await MangaTag.find();
            return manga_tags.map(tag => mappingDocToDTO(tag));
      }

      async findMangaTagByTag(tag: string): Promise<MangaTagDTO | null> {
            const manga_tag = await MangaTag.findOne({tag});
            if(!manga_tag) {
                  return null;
            } 

            return mappingDocToDTO(manga_tag);
      }

      async createMangaTag(data: MangaTagDTO): Promise<MangaTagDTO> {
            const manga_tag = new MangaTag(data);
            const createdMangaTag = await manga_tag.save();
            return mappingDocToDTO(createdMangaTag);
      }
}

function mappingDocToDTO(doc: iMangaTag): MangaTagDTO {
      return {
            _id: doc._id.toString(),
            tag: doc.tag,
      }
}
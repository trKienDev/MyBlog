import { MangaDTO } from "../../dtos/mangas/manga.dto.js";
import Manga, { iManga } from "../../models/mangas/manga.model.js";
import { iMangaRepository } from "./imanga.repository.js";

export class MangaRepository implements iMangaRepository {
      async createManga(data: MangaDTO): Promise<MangaDTO> {
            const manga = new Manga(data);
            const created_manga = await manga.save();
            return mappingDocToDTO(created_manga);
      }
}

function mappingDocToDTO(doc: iManga): MangaDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            image_path: doc.image_path.map(img => img.toString()),
            tags: doc.tags.map(tag => tag.toString()),
            rating: doc.rating,
      }
}
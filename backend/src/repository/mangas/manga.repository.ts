import { CreateMangaDTO, MangaDTO } from "../../dtos/mangas/manga.dto.js";
import Manga, { iManga } from "../../models/mangas/manga.model.js";
import { iMangaRepository } from "./imanga.repository.js";

export class MangaRepository implements iMangaRepository {
      async getMangas(): Promise<MangaDTO[]> {
            const mangas = await Manga.find();
            return mangas.map(manga => mappingDocToDTO(manga));
      }

      async findMangaByName(name: string): Promise<MangaDTO | null> {
            const manga = await Manga.findOne({name});
            if(!manga) {
                  return null;
            }

            return mappingDocToDTO(manga);
      }

      async createManga(data: CreateMangaDTO): Promise<CreateMangaDTO> {
            const manga = new Manga(data);
            const created_manga = await manga.save();
            return mappingDocToCreateDTO(created_manga);
      }
}

function mappingDocToCreateDTO(doc: iManga): CreateMangaDTO {
      return {
            name: doc.name,
            description: doc.description,
            image_path: doc.image_path.map(img => img.toString()),
            tag_ids: doc.tag_ids.map(tag => tag.toString()),
      }
}

function mappingDocToDTO(doc: iManga): MangaDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            image_path: doc.image_path.map(img => img.toString()),
            tag_ids: doc.tag_ids.map(tag => tag.toString()),
            rating: doc.rating,
      }
}


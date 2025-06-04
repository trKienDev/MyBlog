import { InitialMangaDTO, ListImagesMangaDTO, MangaDTO } from "../../dtos/mangas/manga.dto.js";
import Manga, { iManga } from "../../models/mangas/manga.model.js";
import { iMangaRepository } from "./imanga.repository.js";

export class MangaRepository implements iMangaRepository {
      async getMangas(): Promise<MangaDTO[]> {
            const mangas = await Manga.find();
            return mangas.map(manga => mappingDocToDTO(manga));
      }
      async findMangaById(id: string): Promise<MangaDTO | null> {
            const manga = await Manga.findById(id);
            if(!manga) {
                  return null;
            }
            return mappingDocToDTO(manga);
      }
      async findMangaByName(name: string): Promise<MangaDTO | null> {
            const manga = await Manga.findOne({name});
            if(!manga) {
                  return null;
            }

            return mappingDocToDTO(manga);
      }
      async initialManga(data: InitialMangaDTO): Promise<InitialMangaDTO> {
            const new_manga = new Manga(data);
            const initialized_manga = await new_manga.save();
            return mappingDocToInitialDTO(initialized_manga);
      }
      async updateImageListToManga(id: string, data: ListImagesMangaDTO): Promise<MangaDTO> {
            const manga = await Manga.findById(id);
            if(!manga) {
                  throw new Error(`Manga with ID ${id} not found for updating image_path.`);
            }
            manga.manga_folder = data.manga_folder;
            data.image_list.forEach(image => manga.image_list.push(image));
            const updatedManga = await manga.save();
            return mappingDocToDTO(updatedManga);
      }
}

function mappingDocToInitialDTO(doc: iManga): InitialMangaDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            thumbnail: doc.thumbnail,
            tag_ids: doc.tag_ids.map(tag => tag.toString()),
      }
}

function mappingDocToDTO(doc: iManga): MangaDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            thumbnail: doc.thumbnail,
            image_list: doc.image_list.map(img => img.toString()),
            tag_ids: doc.tag_ids.map(tag => tag.toString()),
            manga_folder: doc.manga_folder,
      }
}


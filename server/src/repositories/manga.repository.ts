 import mongoose, { FilterQuery } from "mongoose";
import { FilterMangaPagination, InitialMangaDTO, ListImagesMangaDTO, MangaDTO, MangasPaginationDTO } from "../dtos/manga.dto.js";
import Manga, { iManga } from "../models/manga.model.js";
import { iMangaRepository } from "./interfaces/imanga.repository.js";
import seedrandom from "seedrandom";

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
      async findRandomizePaginated(page: number, limit: number, filters: FilterMangaPagination, seed: string): Promise<MangasPaginationDTO> {
            const filterQueries = this.buildFilterQueries(filters);
            
            const allMatchingFilms = await Manga.find(filterQueries).exec();
            const rng = seedrandom(seed);
            const filmsWithRandomKey = allMatchingFilms.map(filmDoc => ({
                  doc: filmDoc,
                  randomSortKey: rng()
            }));

            const shuffledList = filmsWithRandomKey.sort((a, b) => a.randomSortKey - b.randomSortKey);
            const total = shuffledList.length;
            const skip = (page -1 ) * limit;
            const pageOfWrappedData = shuffledList.slice(skip, skip + limit);
            const finalPageData = pageOfWrappedData.map(item => item.doc.toObject());

            return { mangas: finalPageData, total };
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
      
      private buildFilterQueries(filters: FilterMangaPagination): FilterQuery<iManga> {
            const filterQueries: FilterQuery<iManga> = {};
            if (filters.tag_ids && filters.tag_ids.length > 0) {
                  // Chuyển đổi mỗi chuỗi ID trong mảng thành ObjectId,
                  // đồng thời lọc ra những ID không hợp lệ.
                  const objectIdArray = filters.tag_ids
                        .filter(id => mongoose.Types.ObjectId.isValid(id)) // Chỉ giữ lại các id string hợp lệ
                        .map(id => new mongoose.Types.ObjectId(id));     // Chuyển đổi chúng thành ObjectId

                  // Chỉ thêm vào query nếu có ít nhất một id hợp lệ
                  if (objectIdArray.length > 0) {
                        filterQueries.tag_ids = { $in: objectIdArray };
                  }
            }

            return filterQueries;
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


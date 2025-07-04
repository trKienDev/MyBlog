import mongoose, { FilterQuery } from "mongoose";
import { AnimeFilmDTO, AnimeFilmsPaginationDTO, CreateAnimeFilmDTO, FilterAnimeFilmsPagination, UpdateAnimeFilmDTO } from "../dtos/anime-film.dto.js";
import AnimeFilm, { iAnimeFilm } from "../models/anime-film.model.js";
import { iAnimeFilmRepository } from "./interfaces/ianime-film.repository.js";
import seedrandom from "seedrandom";

export class AnimeFilmRepository implements iAnimeFilmRepository {
      async getAnimeFilms(): Promise<AnimeFilmDTO[] | null> {
            const anime_films = await AnimeFilm.find();
            if(!anime_films) {
                  return null;
            }
            return anime_films.map(doc => mappingDocToDTO(doc));
      }
      async findById(id: string): Promise<AnimeFilmDTO | null> {
            const anime_film = await AnimeFilm.findById(id);
            return anime_film ? mappingDocToDTO(anime_film) : null;
      }
      async findByName(name: string): Promise<AnimeFilmDTO | null> {
            return await AnimeFilm.findOne({name});
      }
      async findRandomizePaginated(page: number, limit: number, filters: FilterAnimeFilmsPagination, seed: string): Promise<AnimeFilmsPaginationDTO> {
            const filterQueries = this.buildFilterQueries(filters);
            
            const allMatchingFilms = await AnimeFilm.find(filterQueries).exec();
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

            return { animeFilms: finalPageData, total };
      }
      
      async createAnimeFilm(data: CreateAnimeFilmDTO): Promise<CreateAnimeFilmDTO> {
            const new_animeFilm = new AnimeFilm({
                  name: data.name,
                  studio_id: new mongoose.Types.ObjectId(data.studio_id),
                  
                  year: data.year,
                  rating: data.rating || 0,
                  thumbnail: data.thumbnail,
            });
            if(data.series_id) {
                  new_animeFilm.series_id = new mongoose.Types.ObjectId(data.series_id);
            }
            if(data.tag_ids) {
                  new_animeFilm.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            }
            const saved_animeFilm = await new_animeFilm.save();

            return mappingDocToCreateDTO(saved_animeFilm);
      }

      async updateAnimeFilm(id: string, data: Partial<UpdateAnimeFilmDTO>): Promise<UpdateAnimeFilmDTO | null> {
            const update_fields: Record<string, any> = {};
            update_fields.name = data.name;
            if(data.studio_id) update_fields.studio_id = new mongoose.Types.ObjectId(data.studio_id);
            if(data.series_id) update_fields.series_id = new mongoose.Types.ObjectId(data.series_id);
            if(data.tag_ids) update_fields.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            if(data.year) update_fields.year = data.year;
            if(data.thumbnail) update_fields.thumbnail = data.thumbnail;
            if(data.rating) update_fields.rating = data.rating;

            const updated_doc = await AnimeFilm.findByIdAndUpdate(
                  id, 
                  { $set: update_fields },
                  { new: true }
            )

            if(updated_doc) {
                  return mappingDocToUpdateDTO(updated_doc);
            } else {
                  return null;
            }
      }

      private buildFilterQueries(filters: FilterAnimeFilmsPagination): FilterQuery<iAnimeFilm> {
            const filterQueries: FilterQuery<iAnimeFilm> = {};
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
            if (filters.studio_id && mongoose.Types.ObjectId.isValid(filters.studio_id)) {
                  filterQueries.studio_id = new mongoose.Types.ObjectId(filters.studio_id);
            }
            if (filters.series_id && mongoose.Types.ObjectId.isValid(filters.series_id)) {
                  filterQueries.series_id = new mongoose.Types.ObjectId(filters.series_id);
            }
            if(filters.rating) filterQueries.rating = filters.rating;

            return filterQueries;
      }
}

function mappingDocToDTO(doc: iAnimeFilm): AnimeFilmDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            studio_id: doc.studio_id.toString(),
            series_id: doc?.series_id?.toString(), 
            ...(doc.tag_ids?.length && {
                  tag_ids: doc.tag_ids.map(id => id.toString())
            }),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            ...(doc.video_ids?.length && { 
                  video_ids: doc.video_ids.map(id => id.toString())
            }),
            year: doc.year,
            thumbnail: doc.thumbnail,
            rating: doc.rating,
      }
}

function mappingDocToCreateDTO(doc: iAnimeFilm): CreateAnimeFilmDTO {
      return {
            name: doc.name,
            studio_id: doc.studio_id.toString(),
            series_id: doc?.series_id?.toString(),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            year: doc.year,
            thumbnail: doc.thumbnail,
            rating: doc.rating,
      }
}

function mappingDocToUpdateDTO(doc: iAnimeFilm): UpdateAnimeFilmDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            studio_id: doc.studio_id.toString(),
            series_id: doc?.series_id?.toString(),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            year: doc.year,
            thumbnail: doc.thumbnail,
            rating: doc.rating,
      }
}
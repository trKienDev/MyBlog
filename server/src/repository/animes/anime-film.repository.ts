import mongoose from "mongoose";
import { AnimeFilmDTO, CreateAnimeFilmDTO, UpdateAnimeFilmDTO } from "../../dtos/animes/anime-film.dto.js";
import AnimeFilm, { iAnimeFilm } from "../../models/animes/anime-film.model.js";
import { iAnimeFilmRepository } from "./interfaces/ianime-film.repository.js";

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
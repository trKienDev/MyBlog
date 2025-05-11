import mongoose from "mongoose";
import { AnimeFilmDTO, CreateAnimeFilmDTO } from "../../dtos/animes/anime-film.dto.js";
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
      
      async findByName(name: string): Promise<AnimeFilmDTO | null> {
            return await AnimeFilm.findOne({name});
      }
      
      async createAnimeFilm(data: CreateAnimeFilmDTO): Promise<CreateAnimeFilmDTO> {
            const new_animeFilm = new AnimeFilm({
                  name: data.name,
                  studio_id: new mongoose.Types.ObjectId(data.studio_id),
                  series_id: new mongoose.Types.ObjectId(data.series_id),
                  tag_ids: data.tag_ids.map(id => new mongoose.Types.ObjectId(id)),
                  year: data.year,
                  rating: data.rating || 0,
                  thumbnail: data.thumbnail,
            });

            const saved_animeFilm = await new_animeFilm.save();

            return mappingDocToCreateDTO(saved_animeFilm);
      }
}

function mappingDocToDTO(doc: iAnimeFilm): AnimeFilmDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            studio_id: doc.studio_id.toString(),
            series_id: doc.series_id.toString(),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            video_ids: doc.video_ids?.map(id => id.toString()),
            year: doc.year,
            thumbnail: doc.thumbnail,
            rating: doc.rating,
      }
}

function mappingDocToCreateDTO(doc: iAnimeFilm): CreateAnimeFilmDTO {
      return {
            name: doc.name,
            studio_id: doc.studio_id.toString(),
            series_id: doc.series_id.toString(),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            year: doc.year,
            thumbnail: doc.thumbnail,
            rating: doc.rating,
      }
}
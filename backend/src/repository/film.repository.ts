import mongoose from "mongoose";
import { CreateFilmDTO, FilmDTO } from "../dtos/film.dto.js";
import { iFilmRepository } from "./interfaces/ifilm.repository.js";
import Film from "../models/film.model.js";
import { iFilm } from "../models/interface/ifilm.model.js";

export class FilmRepository implements iFilmRepository {
      public async GetFilms(): Promise<FilmDTO[] | null> {
            try {
                  const films = await Film.find();
                  return films.map(doc => MappingDocToDTO(doc));
            } catch(error) {
                  console.error('Error in GetFilms: ', error);
                  return null;
            }
      }
      public async CreateFilm(data: CreateFilmDTO): Promise<CreateFilmDTO> {
            const newFilm = new Film({
                  name: data.name,
                  code_id: new mongoose.Types.ObjectId(data.code_id),
                  studio_id: new mongoose.Types.ObjectId(data.studio_id),
                  tag_ids: data.tag_ids.map(id => new mongoose.Types.ObjectId(id)),
                  collection_id: new mongoose.Types.ObjectId(data.collection_id),
                  date: data.date,
                  rating: data.rating || 0,
                  thumbnail: data.thumbnail,
            });

            const savedFilm = await newFilm.save();

            const createdFilm: CreateFilmDTO = {
                  name: savedFilm.name,
                  code_id: savedFilm.code_id.toString(),
                  studio_id: savedFilm.studio_id.toString(),
                  tag_ids: savedFilm.tag_ids.map(id => id.toString()),
                  collection_id: savedFilm.collection_id.toString(),
                  date: savedFilm.date,
                  rating: savedFilm.rating,
                  thumbnail: savedFilm.thumbnail,
            };

            return createdFilm;
      }

      public async FindFilmByName(name: string): Promise<FilmDTO | null> {
            return await Film.findOne({ name });
      }
}

function MappingDocToDTO(doc: iFilm): FilmDTO {
      return {
            _id: doc._id,
            name: doc.name,
            studio_id: doc.studio_id,
            creators_id: doc.creators_id,
            date: doc.date,
            thumbnail: doc.thumbnail,
            rating: doc.rating,
            collection_id: doc.collection_id,
            code_id: doc.code_id,
            tag_ids: doc.tag_ids,
      }
}
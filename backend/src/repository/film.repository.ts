import mongoose from "mongoose";
import { CreateFilmDTO, FilmDTO, UpdateFilmDTO } from "../dtos/film.dto.js";
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
      public async findById(id: string): Promise<FilmDTO | null> {
            try {
                  const film = await Film.findById(id);
                  return film ? MappingDocToDTO(film) : null;
            } catch(error: unknown) {
                  console.error("Repository error:", error);
                  throw error instanceof Error ? error : new Error(String(error));
            }
      }
      public async FindFilmByName(name: string): Promise<FilmDTO | null> {
            return await Film.findOne({ name });
      }
      public async findFilmsByStudioAndCode(studio_id: string, code_id: string): Promise<FilmDTO[] | null> {
            try {
                  const films = await Film.find({
                        studio_id: new mongoose.Types.ObjectId(studio_id),
                        code_id: new mongoose.Types.ObjectId(code_id)
                  });

                  if(films.length === 0) {
                        return null;
                  }
                  
                  return films.map(doc => MappingDocToDTO(doc));
            } catch(error: unknown) {
                  console.error("Repository error:", error);
                  throw error instanceof Error ? error : new Error(String(error));
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

      public async update_film(id: string, data: Partial<UpdateFilmDTO>): Promise<UpdateFilmDTO> {
            const updated_film = await Film.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();

            if(!updated_film) {
                  throw new Error('Error updating film');
            }

            const result: UpdateFilmDTO = {
                  _id: updated_film._id.toString(),
                  name: updated_film.name,
                  code_id: updated_film.code_id.toString(),
                  studio_id: updated_film.studio_id.toString(),
                  collection_id: updated_film.collection_id.toString(),
                  date: updated_film.date,
                  thumbnail: updated_film.thumbnail,
                  rating: updated_film.rating,
                  tag_ids: updated_film.tag_ids.map(item => item.toString()),
            }

            return result;
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
            ...(doc.video_ids?.length && { video_ids: doc.video_ids }),
            collection_id: doc.collection_id,
            code_id: doc.code_id,
            tag_ids: doc.tag_ids,
      }
}
import mongoose from "mongoose";
import { CreateFilmDTO, FilmDTO, UpdateFilmDTO } from "../dtos/film.dto.js";
import { iFilmRepository } from "./interfaces/ifilm.repository.js";
import Film from "../models/film.model.js";
import { iFilm } from "../models/interface/ifilm.model.js";

export class FilmRepository implements iFilmRepository {
      async getFilms(): Promise<FilmDTO[] | null> {
            const films = await Film.find();
            return films.map(film => mappingDocToDTO(film));
      }
      
      async findById(id: string): Promise<FilmDTO | null> {
            try {
                  const film = await Film.findById(id);
                  return film ? mappingDocToDTO(film) : null;
            } catch(error: unknown) {
                  console.error("Repository error:", error);
                  throw error instanceof Error ? error : new Error(String(error));
            }
      }
      
      async findByName(name: string): Promise<FilmDTO | null> {
            return await Film.findOne({ name });
      }
      
      async findFilmsByStudioAndCode(studio_id: string, code_id: string): Promise<FilmDTO[] | null> {
            try {
                  const films = await Film.find({
                        studio_id: new mongoose.Types.ObjectId(studio_id),
                        code_id: new mongoose.Types.ObjectId(code_id)
                  });

                  if(films.length === 0) {
                        return null;
                  }
                  
                  return films.map(doc => mappingDocToDTO(doc));
            } catch(error: unknown) {
                  console.error("Repository error:", error);
                  throw error instanceof Error ? error : new Error(String(error));
            }
      }

      async FindByCreatorId(creator_id: string): Promise<FilmDTO[]> {
            if(!mongoose.Types.ObjectId.isValid(creator_id)) {
                  console.warn("Invalid creator_id");
                  throw new Error('invalid creator_id');
            }

            const films = await Film.find({ creator_ids: new mongoose.Types.ObjectId(creator_id)});
            return films.map(doc => mappingDocToDTO(doc));
      }

      async FindByStudioId(studio_id: string): Promise<FilmDTO[]> {
            if(!mongoose.Types.ObjectId.isValid(studio_id)) {
                  console.warn("Invalid studio_id");
                  throw new Error("Invalid studio_id");
            }

            const films = await Film.find({ studio_id: new mongoose.Types.ObjectId(studio_id)});
            return films.map(doc => mappingDocToDTO(doc));
      }

      async createFilm(data: Partial<CreateFilmDTO>): Promise<Partial<CreateFilmDTO>> {
            const newFilm = new Film({
                  name: data.name,
                  description: data.description,
                  code_id: new mongoose.Types.ObjectId(data.code_id),
                  studio_id: new mongoose.Types.ObjectId(data.studio_id),
                  tag_ids: data.tag_ids?.map(id => new mongoose.Types.ObjectId(id)),
                  date: data.date,
                  rating: data.rating || 0,
                  thumbnail: data.thumbnail,
            });

            if(typeof data.collection_id !== "undefined") {
                  newFilm.collection_id = new mongoose.Types.ObjectId(data.collection_id);
            }
            
            const savedFilm = await newFilm.save();

            const createdFilm: CreateFilmDTO = {
                  name: savedFilm.name,
                  description: savedFilm.description,
                  code_id: savedFilm.code_id.toString(),
                  studio_id: savedFilm.studio_id.toString(),
                  tag_ids: savedFilm.tag_ids.map(id => id.toString()),
                  collection_id: savedFilm.collection_id?.toString(),
                  date: savedFilm.date,
                  rating: savedFilm.rating,
                  thumbnail: savedFilm.thumbnail,
            };
            return createdFilm;
      }

      async updateFilm(id: string, data: Partial<UpdateFilmDTO>): Promise<UpdateFilmDTO | null> {
            const update_fields: Record<string, any> = {};
            update_fields.name = data.name;
            if(data.studio_id) update_fields.studio_id = new mongoose.Types.ObjectId(data.studio_id);
            if(data.code_id) update_fields.code_id = new mongoose.Types.ObjectId(data.code_id);
            if(data.collection_id) update_fields.collection_id = new mongoose.Types.ObjectId(data.collection_id);
            if(data.date) update_fields.date = data.date;
            if(data.rating) update_fields.rating = data.rating;
            if(data.tag_ids) update_fields.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            if(data.thumbnail) update_fields.thumbnail = data.thumbnail;

            const updated_doc = await Film.findByIdAndUpdate(
                  id, 
                  { $set: update_fields },
                  { new: true }
            )

            if(updated_doc) {
                  const updated_film: UpdateFilmDTO = {
                        _id: updated_doc._id.toString(),
                        name: updated_doc.name,
                        code_id: updated_doc.code_id.toString(),
                        studio_id: updated_doc.studio_id.toString(),
                        collection_id: updated_doc.collection_id?.toString(),
                        date: updated_doc.date,
                        thumbnail: updated_doc.thumbnail,
                        rating: updated_doc.rating,
                        tag_ids: updated_doc.tag_ids.map(item => item.toString()),
                  }
                  return updated_film;
            } else {
                  return null;
            }            
      }
}

function mappingDocToDTO(doc: iFilm): FilmDTO {
      return {
            _id: doc._id,
            name: doc.name,
            description: doc?.description ?? '',
            studio_id: doc.studio_id,
            creator_ids: doc.creator_ids,
            date: doc.date,
            thumbnail: doc.thumbnail,
            rating: doc.rating,
            ...(doc.video_ids?.length && { video_ids: doc.video_ids }),
            collection_id: doc.collection_id,
            code_id: doc.code_id,
            tag_ids: doc.tag_ids,
      }
}
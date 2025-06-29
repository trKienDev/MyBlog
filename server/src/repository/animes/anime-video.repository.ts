import mongoose from "mongoose";
import { AnimeVideoDTO, CreateAnimeVideoDTO, UpdateAnimeVideoDTO } from "../../dtos/animes/anime-video.dto.js";
import AnimeVIdeo, { iAnimeVideo } from "../../models/animes/anime-video.model.js";
import { iAnimeVideoRepository } from "./interfaces/ianime-video.repository.js";
import AnimeFilm from "../../models/animes/anime-film.model.js";

export class AnimeVIdeoRepository implements iAnimeVideoRepository {
      async getAnimeVideos(): Promise<AnimeVideoDTO[]> {
            const anime_videos = await AnimeVIdeo.find();
            return anime_videos.map(doc => mappingDocToDTO(doc));
      }

      async findAnimeVideoById(id: string): Promise<AnimeVideoDTO | null> {
            const anime_video = await AnimeVIdeo.findById(id);
            return anime_video ? mappingDocToDTO(anime_video) : null;
      }

      async findAnimeVideoByName(name: string): Promise<AnimeVideoDTO | null> {
            return await AnimeVIdeo.findOne({ name });
      }

      async createAnimeVideo(data: CreateAnimeVideoDTO): Promise<CreateAnimeVideoDTO> {
            const new_video = new AnimeVIdeo({
                  name: data.name,
                  film_id: new mongoose.Types.ObjectId(data.film_id),
                  action_id: new mongoose.Types.ObjectId(data.action_id),
                  ...(data.playlist_id && { playlist_id: new mongoose.Types.ObjectId(data.playlist_id)}),
                  file_path: data.file_path,
            });
            if(data.tag_ids) {
                  new_video.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            }
            
            const created_video = await new_video.save();
            
            await AnimeFilm.findByIdAndUpdate(
                  data.film_id,
                  { $push: {video_ids: created_video._id}}
            );

            return mappingDocToCreateDTO(created_video);
      }

      async updateAnimeVideo(id: string, data: Partial<UpdateAnimeVideoDTO>): Promise<UpdateAnimeVideoDTO | null> {
            const update_fields: Record<string, any> = {};
            if (data.name) update_fields.name = data.name;
            if (data.action_id) update_fields.action_id = new mongoose.Types.ObjectId(data.action_id);
            if (data.film_id) update_fields.film_id = new mongoose.Types.ObjectId(data.film_id);
            if (data.playlist_id) update_fields.playlist_id = new mongoose.Types.ObjectId(data.playlist_id);
            if (data.tag_ids) update_fields.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            if (data.file_path) update_fields.file_path   = data.file_path;

            const updated_doc = await AnimeVIdeo.findByIdAndUpdate(
                  id,
                  { $set: update_fields },
                  { new: true }         
            );

            return updated_doc ? mappingDocToCreateDTO(updated_doc) : null;
      }
}

function mappingDocToCreateDTO(doc: iAnimeVideo): CreateAnimeVideoDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            film_id: doc.film_id.toString(),
            action_id: doc.action_id.toString(),
            playlist_id: doc.playlist_id?.toString() ?? "",
            tag_ids: doc?.tag_ids?.map(id => id.toString()),
            file_path: doc.file_path,
      }
}

function mappingDocToDTO(doc: iAnimeVideo): AnimeVideoDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            action_id: doc.action_id.toString(),
            film_id: doc.film_id.toString(),
            playlist_id: doc?.playlist_id?.toString(),
            tag_ids: doc?.tag_ids?.map(id => id.toString()),
            file_path: doc.file_path,
            views: doc.views,
      }
}
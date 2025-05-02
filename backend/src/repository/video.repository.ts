import mongoose from "mongoose";
import Video from "../models/video.model.js";
import { iVIdeoRepository } from "./interfaces/ivideo.repository.js";
import { iVideo } from "../models/interface/ivideo.model.js";
import { CreateVideoDTO, VideoDTO } from "../dtos/video.dto.js";

export class VideoRepository implements iVIdeoRepository {
      public async getVIdeos(): Promise<VideoDTO[]> {
            const videos = await Video.find();
            return videos.map(doc => mappingDocToDTO(doc));
      }
      public async getVideoByName(name: string): Promise<VideoDTO | null> {
            return await Video.findOne({ name });      
      }
      public async createVideo(data: CreateVideoDTO): Promise<CreateVideoDTO> {
            const new_video = new Video({
                  name: data.name,
                  action_id: new mongoose.Types.ObjectId(data.action_id),
                  film_id: new mongoose.Types.ObjectId(data.film_id),
                  studio_id: new mongoose.Types.ObjectId(data.studio_id),
                  creator_id: new mongoose.Types.ObjectId(data.creator_id),
                  ...(data.playlist_id && { playlist_id: new mongoose.Types.ObjectId(data.playlist_id)}),
                  file_path: data.file_path,
                  tag_ids: data.tag_ids.map(id => new mongoose.Types.ObjectId(id)), 
            });

            const created_video = await new_video.save();
            return mappingDocToCreateDTO(created_video);
      }
}

function mappingDocToCreateDTO(doc: iVideo): CreateVideoDTO {
      return {
            _id: doc._id,
            name: doc.name,
            action_id: doc.action_id.toString(),
            creator_id: doc.creator_id?.toString() ?? "",
            studio_id: doc.studio_id?.toString() ?? "",
            film_id: doc.film_id.toString(),
            playlist_id: doc.playlist_id?.toString() ?? "",
            tag_ids: doc.tag_ids.map(id => id.toString()),
            file_path: doc.file_path,
      }
}

function mappingDocToDTO(doc: iVideo): VideoDTO {
      return {
            _id: doc._id,
            name: doc.name,
            action_id: doc.action_id.toString(),
            creator_id: doc.creator_id?.toString() ?? "",
            film_id: doc.film_id.toString(),
            studio_id: doc.studio_id.toString(),
            playlist_id: doc.playlist_id?.toString() ?? "",
            tag_ids: doc.tag_ids.map(id => id.toString()),
            file_path: doc.file_path,
            views: doc.views,
      }
}


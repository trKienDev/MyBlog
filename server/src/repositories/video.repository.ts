import mongoose from "mongoose";
import Video from "../models/video.model.js";
import { iVideoRepository } from "./interfaces/ivideo.repository.js";
import { iVideo } from "../models/interface/ivideo.model.js";
import { CreateVideoDTO, FilterVideoPagination, UpdateVideoDTO, VideoDTO, VideosPaginationDto } from "../dtos/video.dto.js";
import Film from "../models/film.model.js";

export class VideoRepository implements iVideoRepository {
      async getVideos(): Promise<VideoDTO[]> {
            const videos = await Video.find();
            return videos.map(doc => mappingDocToDTO(doc));
      }
      async GetLatestVideos(): Promise<VideoDTO[]> {
            const latest_videos = await Video.find().sort({ createdAt: -1 })
                                                      .limit(4).exec();

            return latest_videos.map(doc => mappingDocToDTO(doc));
      }

      async GetVideosPagination(page: number, limit: number, filters: FilterVideoPagination): Promise<VideosPaginationDto> {
            const skip = (page - 1) * limit;
            const filterQuery: any = {};
            if(filters.action_id && mongoose.Types.ObjectId.isValid(filters.action_id)) {
                  filterQuery.action_id = new mongoose.Types.ObjectId(filters.action_id);
            }
            if(filters.creator_id && mongoose.Types.ObjectId.isValid(filters.creator_id)) {
                  filterQuery.creator_id = new mongoose.Types.ObjectId(filters.creator_id);
            }
            if(filters.studio_id && mongoose.Types.ObjectId.isValid(filters.studio_id)) {
                  filterQuery.studio_id = new mongoose.Types.ObjectId(filters.studio_id);
            }
            if(filters.code_id && mongoose.Types.ObjectId.isValid(filters.code_id)) {
                  filterQuery.code_id = new mongoose.Types.ObjectId(filters.code_id);
            }

            if(filters.tag_id && mongoose.Types.ObjectId.isValid(filters.tag_id)) {
                  filterQuery.tag_ids = new mongoose.Types.ObjectId(filters.tag_id);
            }
            if(filters.playlist_ids && mongoose.Types.ObjectId.isValid(filters.playlist_ids)) {
                  filterQuery.playlist_ids = new mongoose.Types.ObjectId(filters.playlist_ids);
            }

            const [ videos, total ] = await Promise.all([
                  Video.find(filterQuery)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .exec(),
                  Video.countDocuments(filterQuery).exec()
            ]);
            
            return { videos, total };
      }
      async findById(id: string): Promise<VideoDTO | null> {
            const video = await Video.findById(id);
            return video ? mappingDocToDTO(video) : null;
      }
      async findByName(name: string): Promise<VideoDTO | null> {
            return await Video.findOne({ name });      
      }
      async findByCreatorId(creator_id: string): Promise<VideoDTO[]> {
            if (!mongoose.Types.ObjectId.isValid(creator_id)) {
                  console.warn("Invalid creator_id format");
                  throw new Error('invalid creator_id');
            }

            const videos = await Video.find({ creator_id: new mongoose.Types.ObjectId(creator_id) });
            return videos.map(doc => mappingDocToDTO(doc));
      }

      async createVideo(data: CreateVideoDTO): Promise<CreateVideoDTO> {
            const new_video = new Video({
                  name: data.name,
                  action_id: new mongoose.Types.ObjectId(data.action_id),
                  film_id: new mongoose.Types.ObjectId(data.film_id),
                  code_id: new mongoose.Types.ObjectId(data.code_id),
                  studio_id: new mongoose.Types.ObjectId(data.studio_id),
                  creator_id: new mongoose.Types.ObjectId(data.creator_id),
                  file_path: data.file_path,
                  tag_ids: data.tag_ids.map(id => new mongoose.Types.ObjectId(id)), 
            });
            const created_video = await new_video.save();

            await Film.findByIdAndUpdate(
                  data.film_id,
                  { 
                        $push: { video_ids: created_video._id },
                        $addToSet: { creator_ids: created_video.creator_id },
                  },
            );

            return mappingDocToCreateDTO(created_video);            
      }

      async updateVideo(id: string, data: Partial<UpdateVideoDTO>): Promise<UpdateVideoDTO | null> {
            const update_fields: Record<string, any> = {};
            if (data.name) update_fields.name = data.name;
            if (data.action_id) update_fields.action_id = new mongoose.Types.ObjectId(data.action_id);
            if (data.creator_id) update_fields.creator_id = new mongoose.Types.ObjectId(data.creator_id);
            if (data.studio_id) update_fields.studio_id = new mongoose.Types.ObjectId(data.studio_id);
            if (data.film_id) update_fields.film_id = new mongoose.Types.ObjectId(data.film_id);
            if (data.code_id) update_fields.code_id = new mongoose.Types.ObjectId(data.code_id);
            if (data.tag_ids) update_fields.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            if (data.file_path) update_fields.file_path   = data.file_path;

            const updated_doc = await Video.findByIdAndUpdate(
                  id,
                  { $set: update_fields },
                  { new: true }         
            );

            return updated_doc ? mappingDocToDTO(updated_doc) : null;
      }

      async addPlaylistsToVideo(video_id: string, playlistIds_toAdd: string[]): Promise<VideoDTO | null> {
            const updated_video = await Video.findByIdAndUpdate(
                  video_id,
                  { $set: { playlist_ids: playlistIds_toAdd }}, 
                  {
                        new: true,
                        runValidators: true
                  }
            ).exec();

            return updated_video ? mappingDocToDTO(updated_video) : null;
      }

      async increaseVideoViewsByOne(video_id: string): Promise<VideoDTO | null> {
            const updated_video = await Video.findByIdAndUpdate(
                  video_id,
                  { $inc: {views: 1 }},
                  { new: true }
            ).exec();

            return updated_video ? mappingDocToDTO(updated_video) : null;
      }

      async increaseVideoLikeByOne(video_id: string): Promise<VideoDTO | null> {
            const updated_video = await Video.findByIdAndUpdate(
                  video_id,
                  { $inc: { likes: 1 }},
                  { new: true }
            ).exec();

            return updated_video ? mappingDocToDTO(updated_video) : null;
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
            code_id: doc.code_id.toString(),
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
            code_id: doc.code_id.toString(),
            studio_id: doc.studio_id.toString(),
            playlist_ids: doc.playlist_ids?.map(id => id.toString()),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            file_path: doc.file_path,
            views: doc.views,
            likes: doc.likes,
      }
}


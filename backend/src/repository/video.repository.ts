import mongoose from "mongoose";
import { VideoDTO } from "../dtos/video.dto";
import Video from "../models/video.model";
import { iVIdeoRepository } from "./interfaces/ivideo.repository";

export class VideoRepository implements iVIdeoRepository {
      public async createVideo(data: VideoDTO): Promise<VideoDTO[] | null> {
            const new_video = new Video({
                  name: data.name,
                  creator_id: new mongoose.Types.ObjectId(data.creator_id),
                  ...(data.playlist_id && { playlist_id: new mongoose.Types.ObjectId(data.playlist_id)}),
                  file_path: data.file_path,
                  tag_ids: data.tag_ids.map(id => new mongoose.Types.ObjectId(id)),
            });

            const created_video = await new_video.save();

      }
}



import mongoose from "mongoose";
import { iVideo } from "../models/interface/ivideo.model";

export interface CreateVideoDTO {
      _id?: mongoose.Types.ObjectId;
      name: string;
      action_id: string;
      creator_id?: string;
      film_id: string;
      code_id: string;
      studio_id: string;
      tag_ids: string[];
      file_path: string;
}

export interface UpdateVideoDTO {
      _id?: mongoose.Types.ObjectId;
      name: string;
      action_id: string;
      creator_id?: string;
      film_id: string;
      code_id: string;
      studio_id: string;
      playlist_id?: string[];
      tag_ids: string[];
      file_path: string;
}

export interface VideoDTO {
      _id?: mongoose.Types.ObjectId;
      name: string;
      action_id: string;
      creator_id: string;
      film_id: string;
      code_id: string;
      studio_id: string;
      playlist_ids?: string[];
      tag_ids: string[];
      file_path: string;
      views: number;
      likes: number;
}

export interface iPaginatedVideoDto {
      videos: iVideo[];
      total: number;
}

export interface iVIdeoPaginatedFilters {
      tag_id?: string;
      creator_id?: string;
      studio_id?: string;
      code_id?: string;
      playlist_id?: string;
      action_id?: string;
}

import mongoose from "mongoose";

export interface CreateVideoDTO {
      _id?: mongoose.Types.ObjectId;
      name: string;
      action_id: string;
      creator_id?: string;
      film_id: string;
      code_id: string;
      studio_id: string;
      playlist_id?: string;
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
      playlist_id?: string;
      tag_ids: string[];
      file_path: string;
      views: number;
}
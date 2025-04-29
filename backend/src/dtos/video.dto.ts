import mongoose from "mongoose";

export interface VideoDTO {
      _id?: mongoose.Types.ObjectId;
      name: string;
      creator_id: mongoose.Types.ObjectId;
      playlist_id?: mongoose.Types.ObjectId;
      tag_ids: mongoose.Types.ObjectId[];
      file_path: string;
}
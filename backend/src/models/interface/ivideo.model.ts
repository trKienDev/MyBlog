import mongoose, { Document } from "mongoose";

export interface iVideo extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      action_id: mongoose.Types.ObjectId;
      creator_id: mongoose.Types.ObjectId;
      film_id: mongoose.Types.ObjectId;
      code_id: mongoose.Types.ObjectId;
      studio_id: mongoose.Types.ObjectId;
      playlist_id: mongoose.Types.ObjectId;
      tag_ids: mongoose.Types.ObjectId[];
      file_path: string;
      views: number;
      likes: number;
}


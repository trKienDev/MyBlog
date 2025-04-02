import mongoose, { Document } from "mongoose";

export interface iFilm extends Document {
      name: string;
      code_id: mongoose.Types.ObjectId;
      studio_id: mongoose.Types.ObjectId[];
      creator_id: mongoose.Types.ObjectId[];
      tag_id: mongoose.Types.ObjectId[];
      collection_id: mongoose.Types.ObjectId;
      video_id: mongoose.Types.ObjectId[];
      release_date: Date,
      thumbnail: string;
      rating: number;
}

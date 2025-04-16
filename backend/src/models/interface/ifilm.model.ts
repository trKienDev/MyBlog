import mongoose from "mongoose";

export interface iFilm extends Document {
      name: string;
      code_id: mongoose.Types.ObjectId;
      studio_id: mongoose.Types.ObjectId[];
      creator_id: mongoose.Types.ObjectId[];
      tag_ids: mongoose.Types.ObjectId[];
      collection_id: mongoose.Types.ObjectId;
      video_id: mongoose.Types.ObjectId[];
      date: Date,
      thumbnail: string;
      rating: number;
}

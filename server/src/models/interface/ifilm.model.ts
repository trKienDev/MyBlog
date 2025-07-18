import mongoose from "mongoose";

export interface iFilm extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      description: string;
      code_id: mongoose.Types.ObjectId;
      studio_id: mongoose.Types.ObjectId;
      creator_ids: mongoose.Types.ObjectId[];
      tag_ids: mongoose.Types.ObjectId[];
      collection_id?: mongoose.Types.ObjectId;
      video_ids?: mongoose.Types.ObjectId[];
      date: Date,
      age?: number;
      thumbnail: string;
      rating: number;
}

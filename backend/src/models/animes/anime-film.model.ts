import mongoose, { Document } from "mongoose";

export interface IAnimeFilm extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      studio_id: mongoose.Types.ObjectId;
      series_id: mongoose.Types.ObjectId;
      tag_ids: mongoose.Types.ObjectId;
      video_ids?: mongoose.Types.ObjectId[];
      year: number;
      thumbnail: string;
      rating: number;
}
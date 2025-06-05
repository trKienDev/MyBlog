import mongoose, { Document } from "mongoose";

export interface ICreator extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      identifier_name: string;
      birth: Date;
      image: string;
      studio_ids: mongoose.Types.ObjectId[];
      film_ids: mongoose.Types.ObjectId[];
      video_ids: mongoose.Types.ObjectId[];
}
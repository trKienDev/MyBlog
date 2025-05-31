import mongoose, { Document } from "mongoose";

export interface ICreator extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      birth: Date;
      image: string;
      studio_id: mongoose.Types.ObjectId[];
}
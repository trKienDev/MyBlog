import mongoose from "mongoose";

export interface IStudio extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      image?: string;
      code: mongoose.Types.ObjectId[];
      creator: mongoose.Types.ObjectId[];
}
import mongoose from "mongoose";

export interface IStudio extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      codes: mongoose.Types.ObjectId[];
      creators: mongoose.Types.ObjectId[];
      films: mongoose.Types.ObjectId[];
}
import mongoose, { Document } from "mongoose";

export interface iCollection extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      film_id: mongoose.Types.ObjectId[];
}
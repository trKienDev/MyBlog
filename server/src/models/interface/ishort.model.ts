import mongoose from "mongoose";

export interface iShort extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      
}
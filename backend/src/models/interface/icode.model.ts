
import mongoose, { Document } from "mongoose";

export interface iCode extends Document {
      _id: mongoose.Types.ObjectId;
      studio_id: mongoose.Types.ObjectId;
      code: string;
}
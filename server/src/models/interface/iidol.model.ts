import mongoose from "mongoose";

export interface iIdol extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      identifier_name: string;
      avatar_url: string;
      region: string;
}
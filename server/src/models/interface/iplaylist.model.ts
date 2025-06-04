import mongoose, { Document } from "mongoose";

export interface iPlaylist extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      video_id: mongoose.Types.ObjectId[];
}
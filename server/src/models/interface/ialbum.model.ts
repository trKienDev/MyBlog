import mongoose from "mongoose";

export interface iAlbum extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      image_ids: mongoose.Types.ObjectId[];
}
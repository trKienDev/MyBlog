import mongoose from "mongoose";

export interface iGallery extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      image_ids: mongoose.Types.ObjectId[];
}
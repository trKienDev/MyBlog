import mongoose from "mongoose";

export interface iImage extends Document {
      _id: mongoose.Types.ObjectId;
      image_url: string;
      idol_id?: mongoose.Types.ObjectId;
      tag_ids?: mongoose.Types.ObjectId[];
      gallery_ids?: mongoose.Types.ObjectId[];
}
import mongoose from "mongoose";

export interface AlbumDTO {
      _id: mongoose.Types.ObjectId;
      name: string;
      clip_ids: mongoose.Types.ObjectId[];
}

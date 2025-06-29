import mongoose from "mongoose";

export interface iShort extends Document {
      _id: mongoose.Types.ObjectId;
      idol_id?: mongoose.Types.ObjectId;
      tag_ids?: mongoose.Types.ObjectId[];
      file_path: string;
      views: number;
      likes: number;
      list_shorts_id?: mongoose.Types.ObjectId; 
}
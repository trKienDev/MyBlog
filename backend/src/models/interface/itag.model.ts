import mongoose, { Document } from "mongoose";

export interface ITag extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      kind: string;
}


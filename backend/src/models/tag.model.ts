import mongoose, { Schema } from "mongoose";
import { ITag } from "./interface/itag.model";

const TagSchema: Schema = new Schema({
      name: { type: String, require: true, unique: true },
      kind: { type: String, },
}, {
      collection: 'Tags',
      timestamps: true
});

const Tag = mongoose.model<ITag>('Tag', TagSchema);
export default Tag;
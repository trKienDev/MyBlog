import mongoose, { Schema } from "mongoose";
import { iShort } from "./interface/ishort.model.js";

const ShortSchema: Schema = new Schema({
      idol_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Idol' },
      list_shorts_id: { type: mongoose.Schema.Types.ObjectId, ref: 'List-Short' },
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },],
      file_path: { type: String, require: true },
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 }
}, {
      collection: 'Short',
      timestamps: true
});

const Short = mongoose.model<iShort>('Short', ShortSchema);
export default Short;
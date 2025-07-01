import mongoose, { Document, Schema } from "mongoose";

export interface iClip extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      record_id: mongoose.Types.ObjectId;
      action_id: mongoose.Types.ObjectId;
      code_id?: mongoose.Types.ObjectId;
      studio_id?: mongoose.Types.ObjectId;
      creator_id?: mongoose.Types.ObjectId;
      idol_id?: mongoose.Types.ObjectId;
      tag_ids?: mongoose.Types.ObjectId[];
      file_path: string;
      views: number;
      likes: number;
      album_ids?: mongoose.Types.ObjectId[];
}

const ClipSchema: Schema = new Schema({
      name: { type: String },
      record_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Record' },
      action_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },
      code_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Code', require: false },
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio', require: false },
      creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', require: false },
      idol_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Idol', require: false },
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', require: false }],
      file_path: { type: String, match: /\.(mp4)$/i },
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      album_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album', require: false }],
}, {
      collection: 'Clips',
      timestamps: true
});

const Clip = mongoose.model<iClip>('Clip', ClipSchema);
export default Clip;
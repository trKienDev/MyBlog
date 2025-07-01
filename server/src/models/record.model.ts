import mongoose, { Schema } from "mongoose";

export interface iRecord extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      description: string;
      idol_id?: mongoose.Types.ObjectId;
      creator_id?: mongoose.Types.ObjectId;
      code_id?: mongoose.Types.ObjectId;
      tag_ids?: mongoose.Types.ObjectId[];
      studio_id?: mongoose.Types.ObjectId;
      collection_id?: mongoose.Types.ObjectId;
      clip_ids?: mongoose.Types.ObjectId[];
      rating: number;
}

const RecordSchema: Schema = new Schema({
      name: { type: String, unique: true },
      description: { type: String },
      idol_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Idol', require: false },
      creator_ids: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', require: false },
      code_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Code', require: false },
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio'},
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', require: false }],
      clip_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clip', require: false }],
      collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', require: false },
      rating: { type: Number, min: 1, max: 5, }
}, {
      collection: 'Records',
      timestamps: true
});

const Record = mongoose.model<iRecord>('Record', RecordSchema);
export default Record;
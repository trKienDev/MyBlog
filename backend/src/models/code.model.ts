import mongoose, { Schema } from "mongoose";
import { iCode } from "./interface/icode.model";

const CodeSchema: Schema = new Schema({
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
      code: { type: String, required: true },
}, {
      collection: 'Codes',
      timestamps: true,
});

CodeSchema.virtual('film_ids', {
      ref: 'Film',
      localField: '_id',
      foreignField: 'code_id',
      justOne: false,
});

CodeSchema.virtual('video_ids', {
      ref: 'Video',
      localField: '_id',
      foreignField: 'code_id',
      justOne: false
});

CodeSchema.set('toObject', { virtuals: true });
CodeSchema.set('toJSON', { virtuals: true });

const Code = mongoose.model<iCode>('Code', CodeSchema);
export default Code;
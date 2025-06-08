import mongoose, { Schema, Document } from "mongoose";
import { IStudio } from "./interface/istudio.model.js";

// Define schema for Studio
const StudioSchema: Schema = new Schema ({
      name: { type: String, required: true },
      codes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }], 
      creators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator' }] 
}, {
      collection: 'Studios', 
      timestamps: true
});

StudioSchema.virtual('video_ids', {
      ref: 'Video',
      localField: '_id',
      foreignField: 'studio_id',
      justOne: false
});

StudioSchema.set('toObject', { virtuals: true });
StudioSchema.set('toJSON', { virtuals: true });

const Studio = mongoose.model<IStudio>('Studio', StudioSchema);
export default Studio;
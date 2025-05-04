import mongoose, { Schema } from "mongoose";
import { ITag } from "./interface/itag.model";

const TagSchema: Schema = new Schema({
      name: { type: String, require: true, unique: true },
      kind: { type: String, },
}, {
      collection: 'Tags',
      timestamps: true
});

TagSchema.virtual('film_ids', {
      ref: 'Film',        
      localField: '_id',    
      foreignField: 'tag_ids', 
      justOne: false        
});

TagSchema.virtual('video_ids', {
      ref: 'Video',            
      localField: '_id',
      foreignField: 'tag_ids',
      justOne: false
});

TagSchema.set('toObject', { virtuals: true });
TagSchema.set('toJSON',   { virtuals: true });

const Tag = mongoose.model<ITag>('Tag', TagSchema);
export default Tag;
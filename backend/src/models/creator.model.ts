import mongoose, { Schema } from "mongoose";
import { ICreator } from "./interface/icreator.model.js";

const CreatorSchema: Schema = new Schema({
      name: { type: String, required: true },
      birth: { type: Date, required: true, validate: {
            validator: function(value: Date) {
                  return value >= new Date('1900-01-01') && value <= new Date();
            },
            message: 'Birth date must be between January 1, 1900, and today.'
      }},
      image: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
      skin: { type: String, required: true, enum: ['', 'light', 'medium', 'dark'] },
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio', required: false },
      body: { type: String, required: false, enum: ['thin', 'slim', 'chubby'] },
      breast: { type: String, required: false, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
}, 
{   
      collection: 'Creators', 
      timestamp: true 
});

CreatorSchema.virtual('video_ids', {
      ref: 'Video',
      localField: '_id',
      foreignField: 'creator_id',
      justOne: false
});

CreatorSchema.set('toObject', { virtuals: true });
CreatorSchema.set('toJSON', { virtuals: true });

const Creator = mongoose.model<ICreator>('Creator', CreatorSchema);
export default Creator;




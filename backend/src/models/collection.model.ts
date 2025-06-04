import mongoose, { Schema } from "mongoose";
import { iCollection } from "./interface/icollection.model";

const CollectionSchema: Schema = new Schema({
      name: { type: String, require:  true },
}, {
      collection: 'Collections',
      timestamps: true
});

CollectionSchema.virtual('film_ids', {
      ref: 'FIlm',
      localField: "_id",
      foreignField: 'collection_id',
      justOne: false
});

CollectionSchema.set('toObject', { virtuals: true });
CollectionSchema.set('toJSON', { virtuals: true });

const Collection = mongoose.model<iCollection>('Collection', CollectionSchema);
export default Collection;
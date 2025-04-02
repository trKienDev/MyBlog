import mongoose, { Schema } from "mongoose";
import { iCollection } from "./interface/icollection.model";

const CollectionSchema: Schema = new Schema({
      name: { type: String, require:  true },
      film_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Film'},
}, {
      collection: 'Collections',
      timestamps: true
});

const Collection = mongoose.model<iCollection>('Collection', CollectionSchema);
export default Collection;
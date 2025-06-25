import mongoose, { Schema } from "mongoose";
import { iGallery } from "./interface/igallery.model.js";

const GallerySchema: Schema = new Schema({
      name: { type: String, require: true },
      image_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
}, {
      collection: 'Galleries',
      timestamps: true
});

const Gallery = mongoose.model<iGallery>('Gallery', GallerySchema);
export default Gallery;
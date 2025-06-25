import mongoose, { Schema } from "mongoose";
import { iImage } from "./interface/iimage.model";

const ImageSchema: Schema = new Schema({
      idol_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Idol', required: false },
      image_url: { type: String, required: true },
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', require: false }],
      gallery_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery', required: false }],
}, {
      collection: 'Images',
      timestamps: true
});

const Image = mongoose.model<iImage>('Image', ImageSchema);
export default Image;
import mongoose, { Document, Schema } from "mongoose";

export interface iManga extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      description: string;
      image_path: string[];
      tag_ids: mongoose.Types.ObjectId[];
      rating: Number;
}

const MangaSchema: Schema = new Schema({
      name: { type: String, required: true, unique: true },
      description: { type: String, default: null },
      image_path: [{ type: String, require: true }],
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manga-Tag'}],
      rating: { type: Number, min: 1, max: 5 },
}, { 
      collection: 'Mangas',
      timestamps: true,
});

const Manga = mongoose.model<iManga>('Manga', MangaSchema);
export default Manga; 
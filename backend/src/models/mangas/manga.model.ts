import mongoose, { Document, Schema } from "mongoose";

export interface iManga extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      image_path: string[];
      tags: string[];
      rating: Number;
}

const MangaSchema: Schema = new Schema({
      name: { type: String, required: true },
      image_path: [{ type: String, require: true }],
      tags: [{ type: String }],
      rating: { type: Number, min: 1, max: 5 },
}, { 
      collection: 'Mangas',
      timestamps: true,
});

const Manga = mongoose.model<iManga>('Manga', MangaSchema);
export default Manga; 
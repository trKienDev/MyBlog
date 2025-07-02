import mongoose, { Document, Schema } from "mongoose";

export interface iManga extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      description: string;
      thumbnail: string;
      image_list: string[];
      tag_ids: mongoose.Types.ObjectId[];
      manga_folder: string;
}

const MangaSchema: Schema = new Schema({
      name: { type: String, required: true, unique: true },
      description: { type: String, default: null },
      thumbnail: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
      image_list: [{ type: String, required: true, default: [] }],
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
      manga_folder: { type: String },
}, { 
      collection: 'Mangas',
      timestamps: true,
});

const Manga = mongoose.model<iManga>('Manga', MangaSchema);
export default Manga; 
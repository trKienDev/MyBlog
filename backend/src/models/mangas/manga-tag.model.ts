import mongoose, { Document, Schema } from "mongoose";

export interface iMangaTag extends Document {
      _id: mongoose.Types.ObjectId;
      tag: string;
}

const MangaTagSchema: Schema = new Schema({
      tag: { type: String, required: true, unique: true },
}, {
      collection: 'Manga-Tags',
      timestamps: true
});

const MangaTag = mongoose.model<iMangaTag>('Manga-Tag', MangaTagSchema);
export default MangaTag;
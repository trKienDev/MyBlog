import mongoose, { Document, Schema } from "mongoose";

export interface IAnimeTag extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      kind: string;
}

const AnimeTagSchema: Schema = new Schema({
      name: { type: String, require: true, unique: true},
      kind: { type: String },
}, {
      collection: 'Anime-Tags',
      timestamps: true
});

const AnimeTag = mongoose.model<IAnimeTag>('Anime-Tag', AnimeTagSchema);
export default AnimeTag;
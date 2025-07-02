import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface iAnimeFilm extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      studio_id: mongoose.Types.ObjectId;
      series_id?: mongoose.Types.ObjectId;
      tag_ids: mongoose.Types.ObjectId[];
      video_ids?: mongoose.Types.ObjectId[];
      year: number;
      thumbnail: string;
      rating: number;
}

const AnimeFilmSchema: Schema = new Schema({
      name: { type: String },
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime-Studio' },
      series_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime-Series', require: false },
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime-Tag' }],
      video_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime-Video', require: false }],
      year: { type: Number },
      thumbnail: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
      rating: { type: Number },
}, {
      collection: 'Anime-Films',
      timestamps: true
});

const AnimeFilm = mongoose.model<iAnimeFilm>('Anime-Film', AnimeFilmSchema);
export default AnimeFilm;

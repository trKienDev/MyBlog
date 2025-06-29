import mongoose, { Document, mongo, Schema } from "mongoose";

export interface iAnimeVideo extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      film_id: mongoose.Types.ObjectId;
      action_id: mongoose.Types.ObjectId;
      playlist_id: mongoose.Types.ObjectId;
      tag_ids?: mongoose.Types.ObjectId[];
      file_path: string;
      views: number;
}

const AnimeVideoSchema: Schema = new Schema({
      name: { type: String },
      film_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime-Film' },
      action_id: { type: mongoose.Types.ObjectId, ref: 'Anime-Tag' },
      playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime-Playlist', require: false },
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime-Tag', require: false }],
      file_path: { type: String, match: /\.(mp4)$/i },
      views: { type: Number, default: 0 },
}, {
      collection: 'Anime-Videos',
      timestamps: true
});

const AnimeVIdeo = mongoose.model<iAnimeVideo>('Anime-Video', AnimeVideoSchema);
export default AnimeVIdeo;
import mongoose, { Document, mongo, Schema } from "mongoose";

export interface iAnimePlaylist extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
}

const AnimePlaylistSchema: Schema = new Schema({
      name: { type: String, required: true },
}, {
      collection: 'Anime-Playlists',
      timestamps: true
});

AnimePlaylistSchema.set('toObject', { virtuals: true });
AnimePlaylistSchema.set('toJSON', { virtuals: true });

const AnimePlaylist = mongoose.model<iAnimePlaylist>('Anime-Playlist', AnimePlaylistSchema);
export default AnimePlaylist;

import mongoose, { Schema } from "mongoose";
import { iPlaylist } from "./interface/iplaylist.model";

const PlaylistSchema: Schema = new Schema({
      name: { type: String, require: true },
      video_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
}, {
      collection: 'Playlists',
      timestamps: true
});

PlaylistSchema.virtual('video_ids', {
      ref: 'Video',
      localField: '_id',
      foreignField: 'playlist_id',
      justOne: false,
});

PlaylistSchema.set('toObject', { virtuals: true });
PlaylistSchema.set('toJSON', { virtuals: true });

const Playlist = mongoose.model<iPlaylist>('Playlist', PlaylistSchema);
export default Playlist;
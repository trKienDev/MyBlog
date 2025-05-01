import mongoose, { Schema } from "mongoose";
import { iVideo } from "./interface/ivideo.model";

const VideoSchema: Schema = new Schema({
      name: { type: String },
      action_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },
      creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
      film_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Film' },
      playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', require: false },
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
      file_path: { type: String, match: /\.(mp4)$/i },
}, {
      collection: 'Videos',
      timestamps: true
});

const Video = mongoose.model<iVideo>('Video', VideoSchema);
export default Video;
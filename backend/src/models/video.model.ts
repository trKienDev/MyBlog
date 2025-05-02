import mongoose, { Schema } from "mongoose";
import { iVideo } from "./interface/ivideo.model";

const VideoSchema: Schema = new Schema({
      name: { type: String },
      action_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },
      creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', require: false },
      film_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Film' },
      code_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Code' },
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio', require: false },
      playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', require: false },
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
      file_path: { type: String, match: /\.(mp4)$/i },
      views: { type: Number, default: 0 },
}, {
      collection: 'Videos',
      timestamps: true
});

const Video = mongoose.model<iVideo>('Video', VideoSchema);
export default Video;
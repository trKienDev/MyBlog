import mongoose, { Schema } from "mongoose";
import { iVideo } from "./interface/ivideo.model";

const VideoSchema: Schema = new Schema({
      name: { type: String },
      creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
      playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },
      tag_ids: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
      file_path: { type: String, match: /\.(mp4)$/i },
}, {
      collection: 'Videos',
      timestamps: true
});

const Video = mongoose.model<iVideo>('Video', VideoSchema);
export default Video;
import mongoose, { Document, Schema } from "mongoose";

export interface iAlbum extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      clip_ids: mongoose.Types.ObjectId[];
}

const AlbumSchema: Schema = new Schema({
      name: { type: String, require: true, unique: true },
      clip_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clip', require: false }],
}, {
      collection: 'Albums',
      timestamps: true
});

const Album = mongoose.model<iAlbum>('Album', AlbumSchema);
export default Album;


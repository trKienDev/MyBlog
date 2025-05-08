import mongoose, { Document, Schema } from "mongoose";

export interface IAnimeStudio extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
}

const AnimeStudioSchema: Schema = new Schema({
      name: { type: String, required: true },
}, {
      collection: 'Anime-Studios',
      timestamps: true
});

AnimeStudioSchema.set('toObject', { virtuals: true });
AnimeStudioSchema.set('toJSON', { virtuals: true });

const AnimeStudio = mongoose.model<IAnimeStudio>('Anime-Studio', AnimeStudioSchema);
export default AnimeStudio;
import mongoose, { Document, Schema } from "mongoose";

export interface IAnimeSeries extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
}

const AnimeSeriesSchema: Schema = new Schema({
      name: { type: String, required: true },
}, {
      collection: 'Anime-Series',
      timestamps: true
});

AnimeSeriesSchema.set('toObject', { virtuals: true });
AnimeSeriesSchema.set('toJSON', { virtuals: true });

const AnimeSeries = mongoose.model<IAnimeSeries>('Anime-Seriess', AnimeSeriesSchema);
export default AnimeSeries;
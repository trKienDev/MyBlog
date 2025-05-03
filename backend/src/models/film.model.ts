import mongoose, { Schema } from "mongoose";
import { iFilm } from "./interface/ifilm.model.js";

const FilmSchema: Schema  = new Schema({
      name: { type: String },
      code_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Code'},
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio'},
      creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator'},
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
      collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection'},
      video_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video', require: false }],
      thumbnail: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
      date: { 
            type: Date, 
            validate: {
                  validator: function(value: Date) {
                        return value >= new Date('1900-01-01') && value <= new Date();
                  },
                  message: 'Release date must be between January 1, 1900, and today.'
            }
      },
      rating: {
            type: Number,
            min: 1, max: 5,
      }
}, {
      collection: 'Films',
      timestamps: true
});

const Film = mongoose.model<iFilm>('Film', FilmSchema);
export default Film;
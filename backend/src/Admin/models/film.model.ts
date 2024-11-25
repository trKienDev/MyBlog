import mongoose, { Schema, Document } from "mongoose";

interface IFilm extends Document {
        code: string;
        studio_id: mongoose.Types.ObjectId;
        actress_id: mongoose.Types.ObjectId[];
        tag_id: mongoose.Types.ObjectId[];
        release_date: Date;
        story: string;
        video: mongoose.Types.ObjectId[];
        thumbnail: string;
        rating: number;
}

const FilmSchema: Schema = new Schema({
        code: { type: String},
        studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio'},
        actress_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actress'}],
        tag_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
        release_date: { 
                type: Date, 
                validate: {
                        validator: function(value: Date) {
                                return value >= new Date('1900-01-01') && value <= new Date();
                        },
                        message: 'Release date must be between January 1, 1900, and today.'
                }
        },
        story: { type: String},
        video: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video'}],
        thumbnail: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
        rating: { 
                type: Number, 
                min: 1, 
                max: 5 
        }
}, 
{
        collection: 'Film',
        timestamps: true 
});

const FilmModel = mongoose.model<IFilm>('Film', FilmSchema);
export default FilmModel;
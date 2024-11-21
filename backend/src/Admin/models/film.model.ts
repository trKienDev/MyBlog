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
        code: { type: String, required: true },
        studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio', required: true },
        actress_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actress', required: true }],
        tag_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true }],
        release_date: { 
                type: Date, 
                required: true, 
                validate: {
                        validator: function(value: Date) {
                                return value >= new Date('1900-01-01') && value <= new Date();
                        },
                        message: 'Release date must be between January 1, 1900, and today.'
                }
        },
        story: { type: String, required: true },
        video: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true }],
        thumbnail: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
        rating: { 
                type: Number, 
                required: true, 
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
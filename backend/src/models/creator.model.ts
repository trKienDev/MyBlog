import mongoose, { Schema, Document } from "mongoose";

// Định nghĩa interface cho Actress
interface ICreator extends Document {
      name: string;
      birth: Date;
      image: string;
      skin: string;
      studio: string;
      body: string;
      breast: string;
}

// Định nghĩa schema cho Actress
const CreatorSchema: Schema = new Schema({
      name: { type: String, required: true },
      birth: { type: Date, required: true, validate: {
            validator: function(value: Date) {
                  return value >= new Date('1900-01-01') && value <= new Date();
            },
            message: 'Birth date must be between January 1, 1900, and today.'
      }},
      image: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
      skin: { type: String, required: true, enum: ['', 'light', 'medium', 'dark'] },
      studio: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio', required: false },
      body: { type: String, required: false, enum: ['thin', 'slim', 'chubby'] },
      breast: { type: String, required: false, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
}, 
{   
      collection: 'Creator', 
      timestamp: true 
});

const CreatorModel = mongoose.model<ICreator>('Creator', CreatorSchema);
export default CreatorModel;




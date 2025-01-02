import mongoose, { Schema, Document } from "mongoose";

interface IStudio extends Document {
        name: string;
        image?: string;
        code: mongoose.Types.ObjectId[];
        actress: mongoose.Types.ObjectId[];
}

// Define schema for Studio
const StudioSchema: Schema = new Schema({
        name: { type: String, required: true },
        image: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
        code: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }], 
        actress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actress' }] 
},
{
        collection: 'Studios', 
        timestamps: true
});

const StudioModel = mongoose.model<IStudio>('Studio', StudioSchema);
export default StudioModel;
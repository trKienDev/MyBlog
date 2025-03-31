import mongoose, { Schema, Document } from "mongoose";
import { IStudio } from "./interface/istudio.model.js";

// Define schema for Studio
const StudioSchema: Schema = new Schema ({
        name: { type: String, required: true },
        image: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
        code: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }], 
        creator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator' }] 
},
{
        collection: 'Studios', 
        timestamps: true
});

const Studio = mongoose.model<IStudio>('Studio', StudioSchema);
export default Studio;
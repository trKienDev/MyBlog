import mongoose, { Schema, Document } from "mongoose";
import { IStudioDocument } from "./istudio.document";

// Define schema for Studio
const StudioSchema: Schema = new Schema<IStudioDocument>({
        name: { type: String, required: true },
        image: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
        code: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }], 
        creator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator' }] 
},
{
        collection: 'Studios', 
        timestamps: true
});

const StudioModel = mongoose.model<IStudioDocument>('Studio', StudioSchema);
export default StudioModel;
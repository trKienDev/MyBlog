import mongoose, { Schema, Document } from "mongoose";

interface iCode extends Document {
        codeName: string;
        studio: mongoose.Types.ObjectId[];
}

const CodeSchema: Schema = new Schema({
        codeName: { type: String, required: true },
        studio: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' }
},
{
        collection: 'CodeAVs', // Specify custom collection name
        timestamps: true // Automatically add createdAt and updatedAt timestamps
});    

const CodeModel = mongoose.model<iCode>('CodeAV', CodeSchema);
export default CodeModel;
import mongoose, { Schema, Document } from "mongoose";

interface ICode extends Document {
        codeName: string;
}

const CodeSchema: Schema = new Schema({
        codeName: { type: String, required: true }
},
{
        collection: 'CodeAVs', // Specify custom collection name
        timestamps: true // Automatically add createdAt and updatedAt timestamps
});    

const CodeModel = mongoose.model<ICode>('CodeAV', CodeSchema);
export default CodeModel;
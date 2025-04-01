import mongoose, { Schema } from "mongoose";
import { ICode } from "./interface/icode.model";

const CodeSchema: Schema = new Schema({
      code: { type: String, required: true },
      studio: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' }
}, {
      collection: 'Codes',
      timestamps: true,
});

const Code = mongoose.model<ICode>('Code', CodeSchema);
export default Code;
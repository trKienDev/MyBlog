import mongoose, { Schema } from "mongoose";
import { ICode } from "./interface/icode.model";

const CodeSchema: Schema = new Schema({
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
      code: { type: String, required: true },
}, {
      collection: 'Codes',
      timestamps: true,
});

const Code = mongoose.model<ICode>('Code', CodeSchema);
export default Code;
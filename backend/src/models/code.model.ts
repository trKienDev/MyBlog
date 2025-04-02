import mongoose, { Schema } from "mongoose";
import { iCode } from "./interface/icode.model";

const CodeSchema: Schema = new Schema({
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
      code: { type: String, required: true },
}, {
      collection: 'Codes',
      timestamps: true,
});

const Code = mongoose.model<iCode>('Code', CodeSchema);
export default Code;
import mongoose, { Schema } from "mongoose";
import { iIdol } from "./interface/iidol.model.js";

const IdolSchema: Schema = new Schema({
      name: { type: String, required: true },
      identifier_name: { type: String, required: true },
      avatar_url: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
      region: { type: String, required: false },
}, {
      collection: 'Idols',
      timestamps: true
});

const Idol = mongoose.model<iIdol>('Idol', IdolSchema);
export default Idol;
import mongoose, { Schema, Document } from "mongoose";

interface ITag extends Document {
        name: string;
        kind: string;
}

const TagSchema: Schema = new Schema({
        name: { type: String, require: true, unique: true },
        kind: { type: String, },
}, {
        collection: 'Tags',
        timestamps: true
});

const TagModel = mongoose.model<ITag>('Tag', TagSchema);
export default TagModel;
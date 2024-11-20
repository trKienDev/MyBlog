import mongoose, { Schema, Document } from "mongoose";

interface ITag extends Document {
        name: string;
        kind: string;
        videos: mongoose.Schema.Types.ObjectId[]; 
}

const TagSchema: Schema = new Schema({
        name: { type: String, require: true, unique: true },
        kind: { type: String, },
        videos: [{
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Video', 
        }],
}, {
        collection: 'Tags',
        timestamps: true
});

const TagModel = mongoose.model<ITag>('Tag', TagSchema);
export default TagModel;
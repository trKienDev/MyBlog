import mongoose, { Schema, Document } from "mongoose";

interface IVideo extends Document {
        name: string;
        actress: mongoose.Schema.Types.ObjectId; 
        tag: mongoose.Schema.Types.ObjectId[];
        codeAV: mongoose.Schema.Types.ObjectId;
        filePath: string; // mp4 path
}

const VideoSchema: Schema = new Schema(
        {
                name: { type: String, required: true }, 
                actress: { 
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'Actress', 
                        required: true,
                },
                tag: [{
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'Tag', 
                        required: true, 
                }],
                codeAV: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'CodeAV', 
                        required: true 
                },
                filePath: {
                        type: String,
                        required: true, 
                        match: /\.(mp4)$/i, // Đảm bảo chỉ chấp nhận file mp4
                },
        },
        {
            collection: 'Videos', 
            timestamps: true, 
        }
);

const VideoModel = mongoose.model<IVideo>('Video', VideoSchema);
export default VideoModel;
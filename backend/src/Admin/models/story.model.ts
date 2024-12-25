        import mongoose, { Schema, Document } from "mongoose";

        interface IStory extends Document {
                name: string;
                role_actress: string;
                role_actor: string;
                motip: string;
                detail: string;
                number: number;
        }

        // Define schema for Studio
        const StorySchema: Schema = new Schema({
                name: { type: String },
                role_actress: { type: String },
                role_actor: { type: String },
                motip: { type: String },
                detail: { type: String },
                number: { type: Number }, // Số lượng film có motip story này
        },
        {
                collection: 'Stories', 
                timestamps: true
        });

        const StoryModel = mongoose.model<IStory>('Story', StorySchema);
        export default StoryModel;
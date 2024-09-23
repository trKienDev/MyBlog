import mongoose, { Schema, Document } from "mongoose";
 
// Define Schema
const userSchema: Schema = new Schema({
        username: { type: String, required: true },
        password: { type: String, required: true },
});

// Create Model from Schema
const User = mongoose.model<UserDocument>('User', userSchema);

// Interface model in MongoDB
interface UserDocument extends Document {
        username: string;
        password: string;
}

export default User;
import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the admin document
interface IAdmin extends Document {
        title: string;
}

// Create the schema for admin
const AdminSchema: Schema = new Schema({
        title: { type: String, required: true },
});

// Create and export the model
const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
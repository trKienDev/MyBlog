import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

export async function connectDB(): Promise<void> {
      try {
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to MongoDB successfully');
      } catch(error) {
            console.error('Fail to connect MongoDB', error);
            process.exit(1);
      }
}
import { Document } from "mongoose";

export interface ICreator extends Document {
      name: string;
      birth: Date;
      image: string;
      skin: string;
      studio: string;
      body: string;
      breast: string;
}
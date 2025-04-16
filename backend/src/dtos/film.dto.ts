import mongoose from "mongoose";

export interface CreateFilmDTO {
      name: string;
      code_id: string;
      studio_id: string;
      tag_ids: string[];
      collection_id: string;
      date: Date;
      thumbnail: string;
      rating: number;
}

export interface FilmDTO {
      id?: mongoose.Types.ObjectId;
      name: string;
}
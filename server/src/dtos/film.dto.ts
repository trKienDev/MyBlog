import mongoose from "mongoose";

export interface CreateFilmDTO {
      name: string;
      description?: string;
      code_id: string;
      studio_id: string;
      tag_ids: string[];
      collection_id?: string | '';
      date: Date;
      thumbnail: string;
      rating: number;
}

export interface UpdateFilmDTO {
      _id: string;
      name: string;
      description?: string;
      code_id: string;
      studio_id: string;
      tag_ids: string[];
      collection_id?: string;
      date: Date;
      thumbnail: string;
      rating: number;
}

export interface FilmDTO {
      _id?: mongoose.Types.ObjectId;
      name: string;
      description?: string;
      studio_id: mongoose.Types.ObjectId;
      creator_ids?: mongoose.Types.ObjectId[];
      collection_id?: mongoose.Types.ObjectId;
      video_ids?: mongoose.Types.ObjectId[];
      code_id?: mongoose.Types.ObjectId;
      tag_ids?: mongoose.Types.ObjectId[];
      date: Date;
      thumbnail: string;
      rating: number;
}
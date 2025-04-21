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

export interface updateFilm_dto {
      _id: string;
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
      _id?: mongoose.Types.ObjectId;
      name: string;
      studio_id: mongoose.Types.ObjectId;
      creators_id?: mongoose.Types.ObjectId[];
      collection_id?: mongoose.Types.ObjectId;
      code_id?: mongoose.Types.ObjectId;
      tag_ids?: mongoose.Types.ObjectId[];
      date: Date;
      thumbnail: string;
      rating: number;
}
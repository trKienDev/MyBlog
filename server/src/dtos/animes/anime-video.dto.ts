import mongoose from "mongoose";

export interface AnimeVideoDTO {
      _id?: string;
      name: string;
      film_id: string;
      action_id: string;
      playlist_id?: string;
      tag_ids?: string[];
      file_path: string;
      views: number; 
}

export interface CreateAnimeVideoDTO {
      _id?: string;
      name: string;
      film_id: string;
      action_id: string;
      playlist_id?: string;
      tag_ids?: string[];
      file_path: string; 
}

export interface UpdateAnimeVideoDTO {
      _id?: string;
      name: string;
      film_id: string;
      action_id: string;
      playlist_id?: string;
      tag_ids?: string[];
      file_path: string; 
}
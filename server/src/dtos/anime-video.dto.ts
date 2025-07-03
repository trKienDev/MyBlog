import { iAnimeVideo } from "../models/anime-video.model";

export interface AnimeVideoDTO {
      _id?: string;
      name: string;
      film_id: string;
      playlist_id?: string;
      tag_ids?: string[];
      file_path: string;
      views: number; 
}
export interface CreateAnimeVideoDTO {
      _id?: string;
      name: string;
      film_id: string;
      playlist_id?: string;
      tag_ids?: string[];
      file_path: string; 
}
export interface UpdateAnimeVideoDTO {
      _id?: string;
      name: string;
      film_id: string;
      playlist_id?: string;
      tag_ids?: string[];
      file_path: string; 
}
export interface AnimeVideosPaginationDTO {
      animeVideos: iAnimeVideo[];
      total: number;
}
export interface FilterAnimeVideoPagination {
      film_id?: string;
      tag_id?: string;
}
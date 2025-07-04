import { iAnimeFilm } from "../models/anime-film.model";

export interface CreateAnimeFilmDTO {
      name: string;
      studio_id: string;
      series_id?: string;
      tag_ids: string[];
      year: number;
      thumbnail: string;
      rating: number;
}
export interface AnimeFilmDTO {
      _id: string;
      name: string;
      studio_id: string;
      series_id?: string;
      tag_ids: string[];
      video_ids?: string[];
      year: number;
      thumbnail: string;
      rating: number;
}
export interface UpdateAnimeFilmDTO {
      _id: string;
      name: string;
      studio_id: string;
      series_id?: string;
      tag_ids: string[];
      year: number;
      thumbnail: string;
      rating: number;
}
export interface AnimeFilmsPaginationDTO {
      animeFilms: iAnimeFilm[];
      total: number;
}
export interface FilterAnimeFilmsPagination {
      tag_ids?: string[];
      studio_id?: string;
      rating?: number;
      series_id?: string;
}
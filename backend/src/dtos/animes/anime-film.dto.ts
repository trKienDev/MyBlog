export interface CreateAnimeFilmDTO {
      name: string;
      studio_id: string;
      series_id: string;
      tag_ids: string[];
      year: number;
      thumbnail: string;
      rating: number;
}

export interface AnimeFilmDTO {
      _id: string;
      name: string;
      studio_id: string;
      series_id: string;
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
      series_id: string;
      tag_ids: string[];
      year: number;
      thumbnail: string;
      rating: number;
}
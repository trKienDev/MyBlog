export interface FilmDTO {
      name: string;
      code_id: string;
      studio_id: string[];
      creator_id: string[];
      tag_ids: string[];
      collection_id: string;
      video_id: string[];
      date: Date;
      thumbnail: string;
      rating: number;
}
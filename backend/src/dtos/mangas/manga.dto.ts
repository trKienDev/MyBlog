export interface MangaDTO {
      _id: string;
      name: string;
      description: string;
      image_path: string[];
      tag_ids: string[];
      rating: Number;
}

export interface CreateMangaDTO {
      name: string;
      description: string;
      image_path: string[];
      tag_ids: string[];
}
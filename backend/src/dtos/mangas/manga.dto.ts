export interface MangaDTO {
      _id: string;
      name: string;
      description: string;
      thumbnail: string;
      image_list?: string[];
      tag_ids: string[];
      manga_folder: string;
}

export interface InitialMangaDTO {
      _id?: string;
      name: string;
      description: string;
      thumbnail: string;
      tag_ids: string[];
}

export interface ListImagesMangaDTO {
      image_list: string[], 
      manga_folder: string;
}




export interface CreateShortDTO {
      idol_id?: string;
      tag_ids?: string[],
      file_path: string,
}

export interface ShortDTO {
      _id: string,
      idol_id?: string,
      tag_ids?: string[],
      file_path: string,
      views: number,
      likes: number,
}
export interface CreatorDTO {
      _id?: string;
      name: string;
      identifier_name: string;
      birth: Date;
      image: string;
      studio_ids?: string[];
      films_ids?: string[];
      video_ids?: string[];
      tag_ids?: string[];
      active: boolean;
      views: number;
}

export interface ImageDTO {
      _id?: string;
      image_url: string;
      width: number;
      height: number;
      idol_id?: string;
      tag_ids?: string[];
      gallery_ids: string[];
      likes: number;
}
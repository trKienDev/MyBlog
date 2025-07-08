import { iImage } from "../models/interface/iimage.model";

export interface ImageDTO {
      _id?: string;
      image_url: string;
      width: number;
      height: number;
      idol_id?: string | null;
      tag_ids?: string[];
      gallery_ids: string[];
      likes: number;
}
export interface ImagesPaginationDTO {
      images: iImage[];
      total: number;
}
export interface FilterImagesPagination {
      idol_id?: string;
      tag_ids?: string[];
      gallery_id?: string;
}
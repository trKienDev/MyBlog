import { iShort } from "../models/interface/ishort.model";

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
export interface FiltersShortPagination {
      tag_ids?: string[];
      idol_id?: string;
}
export interface ShortPaginationDto {
      shorts: iShort[];
      total: number;
}
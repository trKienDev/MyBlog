import { ICreator } from "../models/interface/icreator.model";

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
export interface CreatorsPaginationDTO {
      creators: ICreator[];
      total: number,
}
export interface FilterCreatorsPagination {
      studio_id?: string;
      film_id?: string;
      tag_ids?: string[];
}
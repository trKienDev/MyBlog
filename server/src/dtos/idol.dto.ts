import { iIdol } from "../models/interface/iidol.model";

export interface IdolDTO {
      _id?: string;
      name: string;
      identifier_name: string;
      avatar_url: string;
      region?: string;
}
export interface IdolsPaginationDTO {
      idols: iIdol[];
      total: number;
}
export interface FilterIdolPagination {
      region?: string;
}

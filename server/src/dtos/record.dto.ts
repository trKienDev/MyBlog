import { iRecord } from "../models/record.model";

export interface RecordDto {
      _id: string;
      name: string;
      idol_id?: string;
      description: string;
      creator_id?: string;
      studio_id?: string;
      code_id?: string;
      collection_id?: string;
      clip_ids?: string[];
      tag_ids?: string[];
      rating: number;
}
export interface CreateRecordDto {
      name: string;
      description: string;
      idol_id?: string;
      code_id?: string;
      creator_id?: string;
      studio_id?: string;
      collection_id?: string;
      tag_ids?: string[];
      rating: number;
}

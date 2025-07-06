import mongoose from "mongoose";
import { iClip } from "../models/clips.model";

export interface ClipDTO {
      _id: string;
      name: string;
      record_id: string;
      action_id: string;
      code_id?: string;
      studio_id?: string;
      creator_id?: string;
      idol_id?: string;
      tag_ids?: string[];
      file_path: string;
      views: number;
      likes: number;
      album_ids?: string[];
}
export interface CreateClipDTO {
      name: string;
      record_id: string;
      action_id: string;
      code_id?: string;
      studio_id?: string;
      creator_id?: string;
      idol_id?: string;
      tag_ids?: string[];
      file_path: string;
}
export interface ClipPaginationDto {
      clips: iClip[];
      total: number;
}
export interface FiltersClipPagination {
      tag_ids?: string[];
      action_id?: string;
      album_id?: string;
      code_id?: string;
      idol_id?: string;
}
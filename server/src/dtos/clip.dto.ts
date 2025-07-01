import mongoose from "mongoose";

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

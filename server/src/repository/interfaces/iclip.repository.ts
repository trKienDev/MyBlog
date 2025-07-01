import { ClipDTO, CreateClipDTO } from "../../dtos/clip.dto.js";

export interface iClipRepository {
      Create(data: CreateClipDTO): Promise<ClipDTO>;
}
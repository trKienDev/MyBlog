import { ClipDTO, CreateClipDTO } from "../../dtos/clip.dto.js";

export interface iClipRepository {
      FindAll(): Promise<ClipDTO[]>;
      Create(data: CreateClipDTO): Promise<ClipDTO>;
}
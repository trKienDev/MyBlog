import { AlbumDTO } from "../../dtos/album.dto.js";

export interface iAlbumRepository {
      FindAll(): Promise<AlbumDTO[]>;
      Create(data: string): Promise<AlbumDTO>;
}
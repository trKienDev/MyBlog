import { GalleryDTO } from "../../dtos/gallery.dto.js";

export interface iGalleryRepository {
      Create(data: string): Promise<GalleryDTO>;
}
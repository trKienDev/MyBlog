import { ImageDTO } from "../../dtos/image.dto.js";

export interface iImageRepository {
      Create(data: Partial<ImageDTO>): Promise<Partial<ImageDTO>>;
}
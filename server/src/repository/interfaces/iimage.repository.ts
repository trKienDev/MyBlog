import { ImageDTO } from "../../dtos/image.dto.js";

export interface iImageRepository {
      GetAll(): Promise<ImageDTO[]>;
      Create(data: Partial<ImageDTO>): Promise<Partial<ImageDTO>>;
}
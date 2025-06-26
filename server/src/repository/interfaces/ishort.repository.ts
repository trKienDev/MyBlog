import { CreateShortDTO, ShortDTO } from "../../dtos/short.dto.js";

export interface iShortRepository {
      CreateShort(data: CreateShortDTO): Promise<ShortDTO>;
}
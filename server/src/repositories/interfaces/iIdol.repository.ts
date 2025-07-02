import { IdolDTO } from "../../dtos/idol.dto.js";

export interface iIdolRepository {
      Create(data: IdolDTO): Promise<IdolDTO>
      FindByName(name: string): Promise<IdolDTO | null>
}
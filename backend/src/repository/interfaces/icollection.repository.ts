import { CollectionDTO } from "../../dtos/collection.dto.js";

export interface iCollectionRepository {
      CreateCollection(data: string): Promise<CollectionDTO>;
}
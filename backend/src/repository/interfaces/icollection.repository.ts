import { CollectionDTO } from "../../dtos/collection.dto.js";

export interface iCollectionRepository {
      GetCollections(): Promise<CollectionDTO[]>;
      CreateCollection(data: string): Promise<CollectionDTO>;
}
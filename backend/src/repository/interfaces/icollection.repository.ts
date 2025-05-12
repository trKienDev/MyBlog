import { CollectionDTO } from "../../dtos/collection.dto.js";

export interface iCollectionRepository {
      getCollectionById(id: string): Promise<CollectionDTO | null>;
      getCollections(): Promise<CollectionDTO[]>;
      createCollection(data: string): Promise<CollectionDTO>;
}
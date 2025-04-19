import { CollectionDTO } from "../../dtos/collection.dto.js";

export interface iCollectionRepository {
      GetCollection_byId(id: string): Promise<CollectionDTO | null>;
      GetCollections(): Promise<CollectionDTO[]>;
      CreateCollection(data: string): Promise<CollectionDTO>;
}
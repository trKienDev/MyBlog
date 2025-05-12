import Collection from "../models/collection.model.js";
import { CollectionDTO } from "../dtos/collection.dto.js";
import { iCollectionRepository } from "./interfaces/icollection.repository.js";
import { iCollection } from "../models/interface/icollection.model.js";

export class CollectionRepository implements iCollectionRepository {
      public async getCollections(): Promise<CollectionDTO[]> {
            const collections = await Collection.find();
            return collections.map(collection => MappingDocToDTO(collection));
      }
      
      public async getCollectionById(id: string): Promise<CollectionDTO | null> {
            const collection = await Collection.findById(id);
            return collection ? MappingDocToDTO(collection) : null;
      }

      public async createCollection(data: string): Promise<CollectionDTO> {
            const collection = new Collection({ name: data });
            const createdCollection = await collection.save();
            return MappingDocToDTO(createdCollection);
      }
}

function MappingDocToDTO(doc: iCollection): CollectionDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
      }
}
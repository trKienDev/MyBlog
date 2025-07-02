import { IncomingMessage } from "http";
import { parseJSON } from "../middlewares/json-parser.js";
import { iCollectionRepository } from "../repositories/interfaces/icollection.repository.js";

export class CollectionService {
      private collectionRepo: iCollectionRepository;
      constructor(collectionRepository: iCollectionRepository) {
            this.collectionRepo = collectionRepository;
      }

      public async createCollection(req: IncomingMessage) {
            const requiredParam = ['name'];
            const body = await parseJSON(req, requiredParam);
            
            const { name } = body;
            if(!name) {
                  console.error('Error parsing json in createCollection in collection.service');
            }

            const newCollection = await this.collectionRepo.createCollection(name);
            return newCollection;
      }
}
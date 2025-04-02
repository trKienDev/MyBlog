import { IncomingMessage } from "http";
import { iCollectionRepository } from "../repository/interfaces/icollection.repository.js";
import { parseJSON } from "../middlewares/jsonParser.js";

export class CollectionService {
      private collectionRepo: iCollectionRepository;
      constructor(collectionRepository: iCollectionRepository) {
            this.collectionRepo = collectionRepository;
      }

      public async createCollection(req: IncomingMessage) {
            const requiredParam = ['name'];
            const body = await parseJSON(req, requiredParam);
            const name = body.name as string
            if(!name) {
                  console.error('Error parsing json in createCollection in collection.service');
            }

            const newCollection = await this.collectionRepo.CreateCollection(name);
            return newCollection;
      }
}
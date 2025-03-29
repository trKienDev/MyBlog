import { CreatorDTO } from "../dtos/creator.dto.js";
import Creator from "../models/creator.model.js";
import { ICreator } from "../models/icreator.model.js";
import { ICreatorRepository } from "./icreator.repository.js";

export class CreatorRepository implements ICreatorRepository {
      public async FindByNameAndBirth(name: string, birth: Date): Promise<CreatorDTO | null> {
            const doc = await Creator.findOne({ name, birth });
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }

      public async Create(data: any): Promise<any> {
            const creator = new Creator(data);
            return creator.save();
      }
}

function MappingDocToDTO(doc: ICreator): CreatorDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            birth: doc.birth,
            image: doc.image,
            body: doc.body,
            breast: doc.breast,
      }
}
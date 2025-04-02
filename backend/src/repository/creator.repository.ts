import { CreatorDTO } from "../dtos/creator.dto.js";
import Creator from "../models/creator.model.js";
import { ICreator } from "../models/interface/icreator.model.js";
import { ICreatorRepository } from "./interfaces/icreator.repository.js";

export class CreatorRepository implements ICreatorRepository {
      public async GetCreators(): Promise<CreatorDTO[] | null> {
            try {
                  const creators = await Creator.find();
                  return creators.map(doc => MappingDocToDTO(doc));
            } catch(error) {
                  console.log("Error in GetCreators: ", error);
                  return null;
            }
            
      }
      
      public async FindById(id: string): Promise<CreatorDTO | null> {
            const doc = await Creator.findById(id).exec();
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }

      public async FindByNameAndBirth(name: string, birth: Date): Promise<CreatorDTO | null> {
            const doc = await Creator.findOne({ name, birth });
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }

      public async Create(data: CreatorDTO): Promise<any> {
            const creator = new Creator(data);
            return creator.save();
      }

      public async UpdateCreator(id: string, data: Partial<CreatorDTO>): Promise<CreatorDTO> {
            const updatedDoc = await Creator.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
            if(!updatedDoc) {
                  throw new Error('Error updating creator');
            }
            return MappingDocToDTO(updatedDoc);
      }
      public async Delete(id: string): Promise<CreatorDTO> {
            const deletedDoc = await Creator.findByIdAndDelete(id).exec();
            if(!deletedDoc) {
                  throw new Error("server: delete creator failed");                  
            }
            return MappingDocToDTO(deletedDoc);
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
            skin: doc.skin,
      }
}
import mongoose from "mongoose";
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
                  console.error("Error in GetCreators: ", error);
                  return null;
            }
            
      }
      public async findById(id: string): Promise<CreatorDTO | null> {
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
      async FindByTagId(tag_id: string): Promise<CreatorDTO[]> {
            if(!mongoose.Types.ObjectId.isValid(tag_id)) {
                  console.warn("Invalid tag_id format");
                  throw new Error('invalid tag id');
            }

            const creators = await Creator.find({ tag_ids: new mongoose.Types.ObjectId(tag_id)});
            return creators.map(doc => MappingDocToDTO(doc));
      }
      public async Create(data: CreatorDTO): Promise<CreatorDTO> {
            const new_creator = new Creator({
                  name: data.name,
                  identifier_name: data.identifier_name,
                  birth: data.birth,
                  image: data.image,
                  active: data.active,
                  views: data.views,
                  tag_ids: data.tag_ids?.map(id => new mongoose.Types.ObjectId(id)),
            });

            const saved_creator = await new_creator.save();

            return MappingDocToDTO(saved_creator);
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
            identifier_name: doc.identifier_name,
            birth: doc.birth,
            image: doc.image,
            active: doc.active,
            views: doc.views,
            tag_ids: doc.tag_ids?.map(id => id.toString()),
      }
}

import { StudioDTO } from "../dtos/studio.dto.js";
import { IStudio } from "../models/interface/istudio.model.js";
import Studio from "../models/studio.model.js";
import { IStudioRepository } from "./interfaces/istudio.repository.js";

export class StudioRepository implements IStudioRepository{
      async FindStudioById(id: string): Promise<StudioDTO | null> {
            const doc = await Studio.findById(id).exec();
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }
      
      async FindStudios(): Promise<StudioDTO[]> {
            const docs = await Studio.find().exec();
            return docs.map(doc => MappingDocToDTO(doc));
      }

      async FindStudioByName(name: string): Promise<StudioDTO | null>{
            const doc = await Studio.findOne({ name }).exec();
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }

      async CreateStudio(name: string, imageName: string): Promise<StudioDTO> {
            const doc = new Studio({ name, image: imageName });
            const savedDoc = await doc.save();
            return MappingDocToDTO(savedDoc);
      }

      async UpdateStudio(id: string, updateData: Partial<StudioDTO>): Promise<StudioDTO> {
            const updateDoc = await Studio.findByIdAndUpdate(id, updateData, { new: true }).exec();
            if(!updateDoc) {
                  throw new Error('Error updating studio');
            }

            return MappingDocToDTO(updateDoc);
      }

      async DeleteStudioById(id: string): Promise<void> {
            const deletedDoc = await Studio.findByIdAndDelete(id).exec();
            if(!deletedDoc) {
                  throw new Error("Studio not found.");
            }
      }
}

function MappingDocToDTO(doc: IStudio): StudioDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            image: doc.image,
      };
}


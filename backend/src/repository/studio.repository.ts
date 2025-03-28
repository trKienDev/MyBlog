
import { StudioDTO } from "../interfaces/studio.dto.js";
import { IStudioDocument } from "../models/istudio.document.js";
import StudioModel from "../models/studio.model.js";
import { IStudioRepository } from "./istudio.repository.js";

export class StudioRepository implements IStudioRepository{
      async FindStudioById(id: string): Promise<StudioDTO | null> {
            const doc = await StudioModel.findById(id).exec();
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }
      
      async FindAllStudios(): Promise<StudioDTO[]> {
            const docs = await StudioModel.find().exec();
            return docs.map(doc => MappingDocToDTO(doc));
      }

      async FindStudioByName(name: string): Promise<StudioDTO | null>{
            const doc = await StudioModel.findOne({ name }).exec();
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }

      async CreateStudio(name: string, imageName: string): Promise<StudioDTO> {
            const doc = new StudioModel({ name, image: imageName });
            const savedDoc = await doc.save();
            return MappingDocToDTO(savedDoc);
      }

      async UpdateStudio(id: string, updateData: Partial<StudioDTO>): Promise<StudioDTO> {
            const updateDoc = await StudioModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
            if(!updateDoc) {
                  throw new Error('Studio not found');
            }
            console.log("updateDoc: ", updateDoc);
            return MappingDocToDTO(updateDoc);
      }

      async DeleteStudioById(id: string): Promise<void> {
            const deletedDoc = await StudioModel.findByIdAndDelete(id).exec();
            if(!deletedDoc) {
                  throw new Error("Studio not found.");
            }
      }
}

function MappingDocToDTO(doc: IStudioDocument): StudioDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            image: doc?.image,
            code: doc.code?.map((objId) => objId.toString()),
            creator: doc.creator?.map((objId) => objId.toString()),
      };
}


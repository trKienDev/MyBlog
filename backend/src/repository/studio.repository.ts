
import { StudioDTO } from "../interfaces/studio.dto.js";
import { IStudioDocument } from "../models/istudio.document.js";
import StudioModel from "../models/studio.model.js";
import { IStudioRepository } from "./istudio.repository.js";

export class StudioRepository implements IStudioRepository{
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


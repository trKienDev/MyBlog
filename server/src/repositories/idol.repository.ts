import { IdolDTO } from "../dtos/idol.dto.js";
import Idol from "../models/idol.model.js";
import { iIdol } from "../models/interface/iidol.model.js";
import { iIdolRepository } from "./interfaces/iIdol.repository.js";

export class IdolRepository implements iIdolRepository {
      async GetAll(): Promise<IdolDTO[]> {
            const idols_doc = await Idol.find();
            return idols_doc.map(doc => MappingDocToDTO(doc));
      }

      async Create(data: IdolDTO): Promise<IdolDTO> {
            console.log('data: ', data);
            const new_idol = new Idol({
                  name: data.name,
                  identifier_name: data.identifier_name,
                  avatar_url: data.avatar_url,
                  region: data?.region ?? "",
            });
            console.log('new idol: ', new_idol);
            const saved_idol = await new_idol.save();
            return MappingDocToDTO(saved_idol);
      }

      async FindByName(name: string): Promise<IdolDTO | null> {
            const idol_doc = await Idol.findOne({ name });
            if(!idol_doc) return null;
            
            return MappingDocToDTO(idol_doc);
      }
}

function MappingDocToDTO(doc: iIdol): IdolDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            identifier_name: doc.identifier_name,
            avatar_url: doc.avatar_url,
            region: doc?.region ?? "",
      }
}
import mongoose from "mongoose";
import { CreateShortDTO, ShortDTO } from "../dtos/short.dto.js";
import Short from "../models/short.model.js";
import { iShortRepository } from "./interfaces/ishort.repository.js";
import { iShort } from "../models/interface/ishort.model.js";

export class ShortRepository implements iShortRepository {
      async CreateShort(data: CreateShortDTO): Promise<ShortDTO> {
            const new_short = new Short({
                  idol_id: (data.idol_id) ? new mongoose.Types.ObjectId(data.idol_id) : null,
                  tag_ids: (data.tag_ids) ? data.tag_ids?.map(id => new mongoose.Types.ObjectId(id)) : null,
                  file_path: data.file_path,
            });

            const created_short = await new_short.save();
            return MappingDocToDTO(created_short);
      }
}

function MappingDocToDTO(doc: iShort): ShortDTO {
      return {
            _id: doc._id.toString(),
            idol_id: doc?.idol_id?.toString(),
            tag_ids: doc.tag_ids?.map(id => id.toString()) ?? [],
            file_path: doc.file_path,
            views: doc.views,
            likes: doc.likes,
      }
}
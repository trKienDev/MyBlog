import mongoose from "mongoose";
import { CreateShortDTO, iPaginatedShortDto, iShortPaginatedFilters, ShortDTO } from "../dtos/short.dto.js";
import Short from "../models/short.model.js";
import { iShortRepository } from "./interfaces/ishort.repository.js";
import { iShort } from "../models/interface/ishort.model.js";

export class ShortRepository implements iShortRepository {
      async GetAll(): Promise<ShortDTO[]> {
            const shorts = await Short.find();
            return shorts.map(doc => MappingDocToDTO(doc));
      }
      async GetPaginatedShorts(page: number, limit: number, filters: iShortPaginatedFilters): Promise<iPaginatedShortDto> {
            const skip = (page - 1) * limit;
            const filter_query: any = {};
            if(filters.tag_id && mongoose.Types.ObjectId.isValid(filters.tag_id)) {
                  filter_query.tag_ids = new mongoose.Types.ObjectId(filters.tag_id);
            }
            if(filters.idol_id && mongoose.Types.ObjectId.isValid(filters.idol_id)) {
                  filter_query.idol_id = new mongoose.Types.ObjectId(filters.idol_id);
            }

            const [ shorts, total ] = await Promise.all([
                  Short.find(filter_query)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .exec(),
                  Short.countDocuments(filter_query).exec()
            ]);

            return { shorts, total };
      }
      async Create(data: CreateShortDTO): Promise<ShortDTO> {
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
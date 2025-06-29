import mongoose from "mongoose";
import { CreateRecordDto, RecordDto } from "../dtos/record.dto.js";
import Record, { iRecord } from "../models/record.model.js";
import { iRecordRepository } from "./interfaces/irecord.repository.js";

export class RecordRepository implements iRecordRepository {
      async Create(data: CreateRecordDto): Promise<RecordDto> {
            const new_record = new Record({
                  name: data.name,
                  rating: data.rating || 0,
            });
            if(typeof data.creator_id !== "undefined") new_record.creator_id = new mongoose.Types.ObjectId(data.creator_id);
            if(typeof data.idol_id !== "undefined") new_record.idol_id = new mongoose.Types.ObjectId(data.idol_id);
            if(typeof data.code_id !== "undefined") new_record.code_id = new mongoose.Types.ObjectId(data.code_id);
            if(typeof data.collection_id !== "undefined") new_record.collection_id = new mongoose.Types.ObjectId(data.collection_id);
            if(typeof data.studio_id !== "undefined") new_record.studio_id = new mongoose.Types.ObjectId(data.studio_id);
            if(typeof data.tag_ids !== "undefined") {
                  new_record.tag_ids = data.tag_ids?.map(id => new mongoose.Types.ObjectId(id));
            }

            const saved_record = await new_record.save();
            return MappingDocToDTO(saved_record);
      }
}

function MappingDocToDTO(doc: iRecord): RecordDto {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            idol_id: doc?.idol_id?.toString(),
            creator_id: doc?.creator_id?.toString(),
            code_id: doc?.code_id?.toString(),
            studio_id: doc?.studio_id?.toString(),
            collection_id: doc?.collection_id?.toString(),
            ...(doc.tag_ids && doc.tag_ids.length > 0 && { 
                  tag_ids: doc.tag_ids.map(id => id.toString()) 
            }),
            rating: doc.rating,
      }
}
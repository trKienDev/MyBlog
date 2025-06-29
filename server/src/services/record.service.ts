import { IncomingMessage } from "http";
import { RecordDto } from "../dtos/record.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { iRecordRepository } from "../repository/interfaces/irecord.repository.js";
import { parseJSON } from "../middlewares/json-parser.js";

export class RecordService {
      private _recordRepository: iRecordRepository;
      constructor(recordRepository: iRecordRepository) {
            this._recordRepository = recordRepository;
      }

      async CreateRecord(request: IncomingMessage): Promise<void> {
            const required_param = ['name', 'code_id', 'idol_id', 'creator_id', 'tag_ids', 'studio_id', 'collection_id', 'rating'];
            const body = await parseJSON(request, required_param);
            const { name, code_id, idol_id, creator_id, tag_ids, studio_id, collection_id, rating } = body;

            console.log('name', name);
            console.log('idol_id', idol_id);
            console.log('creator_id', creator_id);
      }
}
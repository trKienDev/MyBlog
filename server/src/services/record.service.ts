import { IncomingMessage } from "http";
import { CreateRecordDto, RecordDto } from "../dtos/record.dto.js";
import { parseJSON } from "../middlewares/json-parser.js";
import { iRecordRepository } from "../repositories/interfaces/irecord.repository.js";

export class RecordService {
      private _recordRepository: iRecordRepository;
      constructor(recordRepository: iRecordRepository) {
            this._recordRepository = recordRepository;
      }

      async CreateRecord(request: IncomingMessage): Promise<RecordDto> {
            const required_param = [ 'record_name', 'code_id', 'creator_id', 'idol_id', 'record_rating', 'studio_id', 'record_description', 'record_tags' ];
            const body = await parseJSON(request, required_param);
            const { record_name, code_id, creator_id, idol_id, record_rating, studio_id, record_description, record_tags } = body;
            
            const create_record_dto: CreateRecordDto = {
                  name: record_name,
                  description: record_description,
                  code_id: code_id,
                  idol_id: idol_id,
                  creator_id: creator_id,
                  rating: record_rating,
                  studio_id: studio_id,
                  tag_ids: record_tags
            }
            
            const created_record = await this._recordRepository.Create(create_record_dto);
            return created_record;
      }
}
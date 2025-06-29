import { CreateRecordDto, RecordDto } from "../../dtos/record.dto.js";

export interface iRecordRepository {
      Create(data: CreateRecordDto): Promise<RecordDto>
}
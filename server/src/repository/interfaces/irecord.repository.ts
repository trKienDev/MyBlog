import { CreateRecordDto, RecordDto } from "../../dtos/record.dto.js";

export interface iRecordRepository {
      GetAll(): Promise<RecordDto[]>;
      Create(data: CreateRecordDto): Promise<RecordDto>;
      FindById(id: string): Promise<RecordDto | null>
}
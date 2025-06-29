import { sendError, sendResponse } from "../middlewares/response.js";
import { RecordRepository } from "../repository/record.repository.js";
import { RecordService } from "../services/record.service.js";
import { IncomingMessage, ServerResponse } from "node:http";

const _recordRepository = new RecordRepository();
const _recordService = new RecordService(_recordRepository);

const CreateRecord = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const created_records = await _recordService.CreateRecord(request);
            return sendResponse(response, 201, created_records);
      } catch(error) {
            console.error('Error creating record: ', error);
            return sendError(response, 500, error);
      }
}

const record_controller = {
      CreateRecord,
}
export default record_controller;
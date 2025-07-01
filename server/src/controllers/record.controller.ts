import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { RecordRepository } from "../repository/record.repository.js";
import { RecordService } from "../services/record.service.js";
import { IncomingMessage, request, ServerResponse } from "node:http";

const _recordRepository = new RecordRepository();
const _recordService = new RecordService(_recordRepository);

const GetAllRecords = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const records = await _recordRepository.GetAll();
            return sendResponse(response, 200, records);
      } catch(error) {
            console.error('Error getting all records: ', error);
            return sendError(response, 500, error);
      }
}

const GetRecordById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const record = await _recordRepository.FindById(id);
            if(record == null) return sendError(response, 404, 'record not found');
            return sendResponse(response, 200, record);
      } catch(error) {
            console.error('Error getting record by id: ', error);
            return sendError(response, 500, error);
      }
}

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
      GetAllRecords,
      GetRecordById,
      CreateRecord,
}
export default record_controller;
import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ShortService } from "../services/short.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { ShortRepository } from "../repositories/short.repository.js";
import { FiltersShortPagination } from "../dtos/short.dto.js";

const _shortRepository = new ShortRepository();
const _shortService = new ShortService(_shortRepository);

const GetAllShorts = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const shorts = await _shortRepository.GetAll();
            return sendResponse(response, 200, shorts);
      } catch(error) {
            console.error('Error getting all shorts: ', error);
            return sendError(response, 500, error);
      }
}

const GetPaginationShorts = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const page_number = parseInt(request.query?.page as string) || 1;
            const limit_number = parseInt(request.query?.limit as string) || 10;
            const filters: FiltersShortPagination = {};
            const query = request.query;
           //  if(query?.tag_id) filters.tag_ids = query.tag_id as string;
            if(query?.idol_id) filters.idol_id = query.idol_id as string;

            const shorts = await _shortService.GetPaginatedShorts(page_number, limit_number, filters);
            return sendResponse(response, 200, shorts);
      } catch(error) {
            console.error('Error getting paginated shorts: ', error);
            return sendError(response, 500, error);
      }
}

const CreateShort = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const created_short = await _shortService.CreateShort(request);
            sendResponse(response, 201, created_short);
      } catch(error) {
            console.error('Error creating short: ', error);
            return sendError(response, 500, error);
      }
}

const short_controller = {
      GetAllShorts,
      GetPaginationShorts,
      CreateShort,
}
export default short_controller;
import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ShortRepository } from "../repository/short.repository.js";
import { ShortService } from "../services/short.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

const _shortRepository = new ShortRepository();
const _shortService = new ShortService(_shortRepository);

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
      CreateShort,
}
export default short_controller;
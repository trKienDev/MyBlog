import { IncomingMessage, request, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { IdolRepository } from "../repository/idol.repository.js";
import { IdolService } from "../services/idol.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

const idol_repository = new IdolRepository();
const idol_service = new IdolService(idol_repository);

const GetAllIdols = async(request: IncomingMessage, response: ServerResponse) => {
      try { 
            const idols = await idol_repository.GetAll();
            return sendResponse(response, 200, idols);
      } catch(error) {
            console.error('Error getting all idols: ', error);
            return sendError(response, 500, error);
      }
}

const CreateIdol = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const created_idol = await idol_service.CreateIdol(request);
            return sendResponse(response, 201, created_idol);
      } catch(error) {
            console.error('Error in CreateIdol: ', error);
            sendError(response, 500, error);
      }
}

const idol_controller = {
      GetAllIdols,
      CreateIdol,
}
export default idol_controller;
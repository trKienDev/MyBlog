import { IncomingMessage, request, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { IdolService } from "../services/idol.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { IdolRepository } from "../repositories/idol.repository.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const _idolRepository = new IdolRepository();
const _idolService = new IdolService(_idolRepository);

const GetAllIdols = async(request: IncomingMessage, response: ServerResponse) => {
      try { 
            const idols = await _idolRepository.GetAll();
            return sendResponse(response, 200, idols);
      } catch(error) {
            console.error('Error getting all idols: ', error);
            return sendError(response, 500, error);
      }
}

const getIdolById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const idol = await _idolRepository.findById(id);
            if(!idol) return sendError(response, 404, 'idol not found');
            return sendResponse(response, 200, idol);
      } catch(error) {
            console.error('Error finding idol by id: ', error);
            return sendError(response, 500, error);
      }
}

const CreateIdol = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const created_idol = await _idolService.CreateIdol(request);
            return sendResponse(response, 201, created_idol);
      } catch(error) {
            console.error('Error in CreateIdol: ', error);
            sendError(response, 500, error);
      }
}

const idol_controller = {
      GetAllIdols,
      CreateIdol,
      getIdolById,
}
export default idol_controller;
import { IncomingMessage, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { CodeRepository } from "../repository/code.repository.js";
import { CodeService } from "../services/code.service.js";
import { send } from "process";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const repository = new CodeRepository();
const service = new CodeService(repository);

const GetCodes = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const codes = await repository.GetCodes();
            return sendResponse(response, 200, codes);
      } catch(error) {
            return sendError(response, 500, error);
      }
}

export const getCode_byId = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const code = await repository.GetCodeById(id);
            if(code == null) {
                  return sendError(response, 404, 'code not found!');
            } 
            return sendResponse(response, 200, code);
      } catch(error) {
            return sendError(response, 500, error);
      }
};

const GetCodesByStudio = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const codes = await service.getCodesByStudioId(id);
            return sendResponse(res, 200, codes);
      } catch(error) {
            console.error('Error in getCodesByStudio in code.controller');
            return sendError(res, 500, error);
      }
}

export const createCode = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdCode = await service.CreateCode(req);
            sendResponse(res, 200, createdCode);
      } catch(error) {
            console.log("error in CreateCode - code.controller.ts");
            return sendError(res, 500, error);
      }
}

const code_controller = {
      GetCodes,
      GetCodesByStudio,
}
export default code_controller;
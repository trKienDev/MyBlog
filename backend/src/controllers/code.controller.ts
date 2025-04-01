import { IncomingMessage, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { CodeRepository } from "../repository/code.repository.js";
import { CodeService } from "../services/code.service.js";

const repository = new CodeRepository();
const service = new CodeService(repository);

export const createCode = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const createdCode = await service.CreateCode(req);
            sendResponse(res, 200, createdCode);
      } catch(error) {
            console.log("error in CreateCode - code.controller.ts");
            return sendError(res, 500, error);
      }
}
import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ClipRepository } from "../repository/clip.repository.js";
import { ClipService } from "../services/clip.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

const _clipRepository = new ClipRepository();
const _clipService = new ClipService(_clipRepository);

const CreateClip = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const created_clip = await _clipService.CreateClip(request);
            return sendResponse(response, 201, created_clip);
      } catch(error) {
            console.error('Error creating clip: ', error);
            return sendError(response, 500, error);
      }
}

const clip_controller = {
      CreateClip,
}
export default clip_controller;
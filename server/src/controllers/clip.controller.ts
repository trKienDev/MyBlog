import { IncomingMessage, request, Server, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ClipService } from "../services/clip.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { ClipRepository } from "../repositories/clip.repository.js";

const _clipRepository = new ClipRepository();
const _clipService = new ClipService(_clipRepository);

const GetClips = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const clips = await _clipRepository.FindAll();
            return sendResponse(response, 200, clips);
      } catch(error) {
            console.error('Error getting clip: ', error);
            return sendError(response, 500, error);
      }
}

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
      GetClips,
      CreateClip,
}
export default clip_controller;
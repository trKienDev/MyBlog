import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ImageRepository } from "../repository/image.repository.js";
import { ImageService } from "../services/image.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

const _imageRepository = new ImageRepository();
const _imageService= new ImageService(_imageRepository);

const CreateImage = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const created_image = await _imageService.CreateImage(request);
            return sendResponse(response, 201, created_image);
      } catch(error) {
            console.error('Error creating image: ', error);
            sendError(response, 500, error);
      }
}

const image_controller = {
      CreateImage,
}
export default image_controller;
import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ImageRepository } from "../repository/image.repository.js";
import { ImageService } from "../services/image.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

const _imageRepository = new ImageRepository();
const _imageService= new ImageService(_imageRepository);

const GetAllImages = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const images = await _imageRepository.GetAll();
            return sendResponse(response, 201, images);
      } catch(error) {
            console.error('Error getting all images: ', error);
            sendError(response, 500, error);
      }
}

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
      GetAllImages,
      CreateImage,
}
export default image_controller;
import { IncomingMessage, ServerResponse } from "http";
import { GalleryRepository } from "../repository/gallery.repository.js";
import { GalleryService } from "../services/gallery.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

const gallery_repository = new GalleryRepository();
const gallery_service = new GalleryService(gallery_repository);

const CreateGallery = async(request: IncomingMessage, response: ServerResponse) => {
      try { 
            const created_gallery = await gallery_service.CreateGallery(request);
            sendResponse(response, 200, created_gallery);
      } catch(error) {
            console.error('Error creating gallery: ', error);
            return sendError(response, 500, error);
      }
}

const gallery_controller = {
      CreateGallery,
}
export default gallery_controller;
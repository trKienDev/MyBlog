import { IncomingMessage, ServerResponse } from "http";
import { GalleryService } from "../services/gallery.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { GalleryRepository } from "../repositories/gallery.repository.js";

const _galleryRepository = new GalleryRepository();
const _galleryService = new GalleryService(_galleryRepository);

const CreateGallery = async(request: IncomingMessage, response: ServerResponse) => {
      try { 
            const created_gallery = await _galleryService.CreateGallery(request);
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
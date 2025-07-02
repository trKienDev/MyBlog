import { IncomingMessage } from "http";
import { parseJSON } from "../middlewares/json-parser.js";
import { iGalleryRepository } from "../repositories/interfaces/igallery.repository.js";

export class GalleryService {
      private gallery_repository: iGalleryRepository;
      constructor(galleryRepository: iGalleryRepository) {
            this.gallery_repository = galleryRepository;
      }

      async CreateGallery(request: IncomingMessage) {
            const required_param = ['name'];
            const body = await parseJSON(request, required_param);

            const { name } = body;
            if(!name) {
                  throw new Error('param name in createPlay not found');
            }

            const new_gallery = await this.gallery_repository.Create(name);
            return new_gallery;
      }
}
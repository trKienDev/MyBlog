import { GalleryDTO } from "../dtos/gallery.dto.js";
import Gallery from "../models/gallery.model.js";
import { iGallery } from "../models/interface/igallery.model.js";
import { iGalleryRepository } from "./interfaces/igallery.repository.js";

export class GalleryRepository implements iGalleryRepository {
      async Create(data: string): Promise<GalleryDTO> {
            const new_gallery = new Gallery({ name: data });
            const created_gallery = await new_gallery.save();
            return MappingDocToDTO(created_gallery);
      }
}

function MappingDocToDTO(doc: iGallery): GalleryDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name
      }
}
import mongoose from "mongoose";
import { ImageDTO } from "../dtos/image.dto.js";
import Image from "../models/image.model.js";
import { iImageRepository } from "./interfaces/iimage.repository.js";
import { iImage } from "../models/interface/iimage.model.js";

export class ImageRepository implements iImageRepository {
      async GetAll(): Promise<ImageDTO[]> {
            const images = await Image.find();
            return images.map(doc => MappingDocToDTO(doc));
      }

      async Create(data: Partial<ImageDTO>): Promise<Partial<ImageDTO>> {
            const new_image = new Image({
                  idol_id: (data && data.idol_id) ? new mongoose.Types.ObjectId(data.idol_id) : null,
                  tag_ids: data.tag_ids?.map(id => new mongoose.Types.ObjectId(id)),
                  image_url: data.image_url,
                  width: data.width,
                  height: data.height,
            });
            console.log('new image: ', new_image);
            const saved_image = await new_image.save();

            return MappingDocToDTO(saved_image);
      }
}

function MappingDocToDTO(doc: iImage): ImageDTO {
      return {
            _id: doc._id.toString(),
            image_url: doc.image_url,
            width: doc.width,
            height: doc.height,
            idol_id: doc?.idol_id?.toString(),
            tag_ids: doc.tag_ids?.map(id => id.toString()) ?? [],
            gallery_ids: doc.gallery_ids?.map(id => id.toString()) ?? [],
            likes: doc.likes,
      }
}
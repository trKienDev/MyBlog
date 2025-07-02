import { ImageDTO } from "../dtos/image.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { iImageRepository } from "../repositories/interfaces/iimage.repository.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class ImageService {
      private _imageRepository: iImageRepository;
      constructor(imageRepository: iImageRepository) {
            this._imageRepository = imageRepository;
      }

      async CreateImage(request: CustomRequest) {
            const { file_name } = await file_utils.uploadFile(request, UploadFiles.IMAGES);
            const idol_id = request_utils.extractParamFromRequest(request, "idol_id");
            let width_str = request_utils.extractParamFromRequest(request, "width");
            let height_str = request_utils.extractParamFromRequest(request, "height");
            const tag_params = request_utils.extractParamFromRequest(request, "tag_ids");
            const tag_ids: string[] = tag_params 
                  ? tag_params.split(',').map((s) => s.trim()).filter((s) => s.length > 0) 
                  : [];

            let width_int: number = parseInt(width_str);
            let height_int: number = parseInt(height_str);

            const new_image: Partial<ImageDTO> = {
                  image_url: file_name,
                  width: width_int,
                  height: height_int,     
                  tag_ids: tag_ids,
            }
            if(idol_id) {
                  new_image.idol_id = idol_id;
            }
            return await this._imageRepository.Create(new_image);
      }

}
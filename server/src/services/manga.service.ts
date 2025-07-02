import { ServerResponse } from "http";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";
import { InitialMangaDTO, ListImagesMangaDTO, MangaDTO } from "../dtos/manga.dto.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import string_utils from "../utils/string.utils.js";
import { UploadFiles } from "../enums.js";
import { iMangaRepository } from "../repository/interfaces/imanga.repository.js";

export class MangaService {
      private repository: iMangaRepository;
      constructor(MangaRepository: iMangaRepository) {
            this.repository = MangaRepository;
      }

      async initialManga(request: CustomRequest): Promise<InitialMangaDTO> {
            const { file_name: thumbnail } = await file_utils.uploadFile(request, UploadFiles.MANGAS);

            const name = request_utils.extractParamFromRequest(request, "name");
            console.log('name in service: ', name);
            const existing_manga = await this.repository.findMangaByName(name);
            if(existing_manga) {
                  throw new Error('This manga has been existed');
            }
            
            const description = request_utils.extractParamFromRequest(request, "description");
            const tags = request_utils.extractParamFromRequest(request, "tag_ids");
            const tag_ids: string[] = tags.split(',').map((string) => string.trim()).filter((string) => string.length > 0);

            const data: InitialMangaDTO = {
                  name,
                  description,
                  thumbnail,
                  tag_ids: tag_ids,
            };

            const initialized_manga = await this.repository.initialManga(data);
            return initialized_manga;
      }

      async addImagesToInitializedManga(request: ValidateIdRequest): Promise<MangaDTO | null> {
            const id = request.params?.id;
            const existing_manga = await this.repository.findMangaById(id);
            if(existing_manga == null) {
                  return null;
            }

            const manga_folder = string_utils.replaceSpacesWithUnderscore(existing_manga.name);
            const { files_name: images } = await file_utils.uploadFiles(request, `${UploadFiles.MANGAS}/${manga_folder}`);
            const data: ListImagesMangaDTO = { 
                  manga_folder: manga_folder,
                  image_list: images 
            }

            const updatedImgs_manga = await this.repository.updateImageListToManga(id, data);
            return updatedImgs_manga;
      }
}
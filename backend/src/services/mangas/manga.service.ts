import { ServerResponse } from "http";
import { iMangaRepository } from "../../repository/mangas/imanga.repository.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import file_utils from "../../utils/file.utils.js";
import { request_utils } from "../../utils/request.utils.js";
import { InitialMangaDTO, MangaDTO } from "../../dtos/mangas/manga.dto.js";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";

export class MangaService {
      private repository: iMangaRepository;
      constructor(MangaRepository: iMangaRepository) {
            this.repository = MangaRepository;
      }

      async initialManga(request: CustomRequest): Promise<InitialMangaDTO> {
            const { file_name: thumbnail } = await file_utils.uploadFile(request, "manga");

            const name = request_utils.extractParamFromRequest(request, "name");
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

      async addImagesToInitializedManga(request: ValidateIdRequest): Promise<MangaDTO> {
            const id = request.params?.id;
            const existing_manga = await this.
      }
}
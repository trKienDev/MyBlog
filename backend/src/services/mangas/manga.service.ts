import { ServerResponse } from "http";
import { CreateMangaDTO } from "../../dtos/mangas/manga.dto.js";
import { iMangaRepository } from "../../repository/mangas/imanga.repository.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import file_utils from "../../utils/file.utils.js";
import { request_utils } from "../../utils/request.utils.js";

export class MangaService {
      private repository: iMangaRepository;
      constructor(MangaRepository: iMangaRepository) {
            this.repository = MangaRepository;
      }

      async createManga(request: CustomRequest): Promise<CreateMangaDTO | null> {
            const { name, file_names } = await file_utils.uploadFiles(request, "manga");
            
            const existing_manga = await this.repository.findMangaByName(name);
            if(existing_manga) {
                  throw new Error('This manga has been existed');
            }

            const description = request_utils.extractParamFromRequest(request, "description");
            const tags = request_utils.extractParamFromRequest(request, "tag_ids");
            const tag_ids: string[] = tags.split(',').map((string) => string.trim()).filter((string) => string.length > 0);

            const data: CreateMangaDTO = {
                  name,
                  description,
                  tag_ids: tag_ids,
                  image_path: file_names,
            };
            console.log('data: ', data);

            const new_manga = await this.repository.createManga(data);
            return new_manga;
      }
}
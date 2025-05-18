import { MangaDTO } from "../dtos/mangas/manga.dto";
import { CustomRequest } from "../interfaces/CustomRequest";
import { iMangaRepository } from "../repository/mangas/imanga.repository";

export class MangaService {
      private repository: iMangaRepository;
      constructor(MangaRepository: iMangaRepository) {
            this.repository = MangaRepository;
      }

      async createManga(req: CustomRequest): Promise<MangaDTO> {
            const 
      }
}
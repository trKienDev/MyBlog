import { AnimeStudioDTO } from "../../dtos/animes/anime-studio.dto.js";
import AnimeStudio, { IAnimeStudio } from "../../models/animes/anime-studio.model.js";
import { IAnimeStudioRepository } from "./interfaces/ianime-studio.repository.js";

export class AnimeStudioRepository implements IAnimeStudioRepository {
      async getAnimeStudios(): Promise<AnimeStudioDTO[]> {
            const anime_studios = await AnimeStudio.find();
            return anime_studios.map(anime_studio => mappingDocToDTO(anime_studio));
      }
      
      async createAnimeStudio(data: string): Promise<AnimeStudioDTO> {
            const anime_studio = new AnimeStudio({ name: data });
            const created_animeStudio = await anime_studio.save();
            return mappingDocToDTO(created_animeStudio);
      }
}

function mappingDocToDTO(doc: IAnimeStudio): AnimeStudioDTO {
      return {
            _id: doc.id.toString(),
            name: doc.name,
      }
}
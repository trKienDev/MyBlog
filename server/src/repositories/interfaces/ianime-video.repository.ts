import { AnimeVideoDTO, AnimeVideosPaginationDTO, CreateAnimeVideoDTO, FilterAnimeVideoPagination, UpdateAnimeVideoDTO } from "../../dtos/anime-video.dto.js";

export interface iAnimeVideoRepository {
      getAnimeVideos(): Promise<AnimeVideoDTO[]>;
      GetAnimeVideosPagination(page: number, limit: number, filters: FilterAnimeVideoPagination): Promise<AnimeVideosPaginationDTO>
      GetUniqueAnimeVideosPagination(page: number, limit: number, filters: FilterAnimeVideoPagination): Promise<AnimeVideosPaginationDTO>
      findAnimeVideoById(id: string): Promise<AnimeVideoDTO | null>;
      findAnimeVideoByName(name: string): Promise<AnimeVideoDTO | null>;
      createAnimeVideo(data: CreateAnimeVideoDTO): Promise<CreateAnimeVideoDTO>;
      updateAnimeVideo(id: string, data: Partial<UpdateAnimeVideoDTO>): Promise<UpdateAnimeVideoDTO | null>;
}
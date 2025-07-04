import { CreateVideoDTO, FilterVideoPagination, UpdateVideoDTO, VideoDTO, VideosPaginationDto } from "../../dtos/video.dto.js";

export interface iVideoRepository {
      getVideos(): Promise<VideoDTO[]>;
      findById(id: string): Promise<VideoDTO | null>;
      findByName(name: string): Promise<VideoDTO | null>;
      findByCreatorId(creator_id: string): Promise<VideoDTO[]>;
      getVideosPagination(page: number, limit: number, filters: FilterVideoPagination): Promise<VideosPaginationDto>;
      getUniqueRandomVideosPagination(page: number, limit: number, filters: FilterVideoPagination): Promise<VideosPaginationDto>;
      getHomepageFeedsVideosPagination(page: number, limit: number, filters: FilterVideoPagination, seed: string): Promise<VideosPaginationDto>;
      getLatestVideos(): Promise<VideoDTO[]>;
      createVideo(data: CreateVideoDTO): Promise<CreateVideoDTO>;
      updateVideo(id: string, data: Partial<UpdateVideoDTO>): Promise<UpdateVideoDTO | null>;
      addPlaylistsToVideo(video_id: string, playlistIds_toAdd: string[]): Promise<VideoDTO | null>;
      increaseVideoViewsByOne(video_id: string): Promise<VideoDTO | null>;
      increaseVideoLikeByOne(video_id: string): Promise<VideoDTO | null>;
}
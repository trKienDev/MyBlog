import { CreateVideoDTO, iPaginatedVideoDto, UpdateVideoDTO, VideoDTO } from "../../dtos/video.dto.js";

export interface iVideoRepository {
      getVideos(): Promise<VideoDTO[]>;
      findById(id: string): Promise<VideoDTO | null>;
      findByName(name: string): Promise<VideoDTO | null>;
      findByCreatorId(creator_id: string): Promise<VideoDTO[]>;
      FindPaginatedVideos(page: number, limit: number): Promise<iPaginatedVideoDto>;
      createVideo(data: CreateVideoDTO): Promise<CreateVideoDTO>;
      updateVideo(id: string, data: Partial<UpdateVideoDTO>): Promise<UpdateVideoDTO | null>;
      addPlaylistsToVideo(video_id: string, playlistIds_toAdd: string[]): Promise<VideoDTO | null>;
      increaseVideoViewsByOne(video_id: string): Promise<VideoDTO | null>;
      increaseVideoLikeByOne(video_id: string): Promise<VideoDTO | null>;
}
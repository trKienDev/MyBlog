import { CreateVideoDTO, UpdateVideoDTO, VideoDTO } from "../../dtos/video.dto.js";

export interface iVIdeoRepository {
      getVIdeos(): Promise<VideoDTO[]>;
      findById(id: string): Promise<VideoDTO | null>;
      findByName(name: string): Promise<VideoDTO | null>;
      findByCreatorId(creator_id: string): Promise<VideoDTO[]>;
      createVideo(data: CreateVideoDTO): Promise<CreateVideoDTO>;
      updateVideo(id: string, data: Partial<UpdateVideoDTO>): Promise<UpdateVideoDTO | null>;
}
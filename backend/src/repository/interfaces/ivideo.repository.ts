import { CreateVideoDTO, VideoDTO } from "../../dtos/video.dto.js";

export interface iVIdeoRepository {
      getVIdeos(): Promise<VideoDTO[]>;
      getVideoByName(name: string): Promise<VideoDTO | null>;
      createVideo(data: CreateVideoDTO): Promise<CreateVideoDTO>;
}
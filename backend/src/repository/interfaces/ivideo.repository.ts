import { VideoDTO } from "../../dtos/video.dto.js";

export interface iVIdeoRepository {
      getVIdeos(): Promise<VideoDTO[]>;
      createVideo(data: VideoDTO): Promise<VideoDTO>;
      getVideoByName(name: string): Promise<VideoDTO | null>;
}
import { VideoDTO } from "../../dtos/video.dto";

export interface iVIdeoRepository {
      createVideo(data: VideoDTO): Promise<VideoDTO[] | null>;
      
}
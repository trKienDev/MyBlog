import { StudioDTO } from "../../dtos/studio.dto";

export interface IStudioRepository {
      findStudioById(id: string): Promise<StudioDTO | null>;
      findStudios(): Promise<StudioDTO[]>;
      findStudioByName(name: string): Promise<StudioDTO | null>;
      createStudio(name: string, imageName: string): Promise<StudioDTO>;
      updateStudio(id: string, updateData: Partial<StudioDTO>): Promise<StudioDTO>;
      deleteStudioById(id: string): Promise<void>;
}
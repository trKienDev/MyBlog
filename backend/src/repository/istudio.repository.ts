import { StudioDTO } from "../interfaces/studio.dto";

export interface IStudioRepository {
      FindStudioById(id: string): Promise<StudioDTO | null>;
      FindAllStudios(): Promise<StudioDTO[]>;
      FindStudioByName(name: string): Promise<StudioDTO | null>;
      CreateStudio(name: string, imageName: string): Promise<StudioDTO>;
      UpdateStudio(id: string, updateData: Partial<StudioDTO>): Promise<StudioDTO>;
      DeleteStudioById(id: string): Promise<void>;
}
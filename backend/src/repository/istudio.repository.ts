import { StudioDTO } from "../interfaces/studio.dto";

export interface IStudioRepository {
      FindStudioByName(name: string): Promise<StudioDTO | null>;
      CreateStudio(name: string, imageName: string): Promise<StudioDTO>;
      FindAllStudios(): Promise<StudioDTO[]>;
}
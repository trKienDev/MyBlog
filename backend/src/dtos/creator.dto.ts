import { StudioDTO } from "./studio.dto";

export interface CreatorDTO {
      _id?: string;
      name: string;
      birth: Date;
      image: string;
      body: string;
      breast: string;
      skin: string;
      studio_id?: string[];
}

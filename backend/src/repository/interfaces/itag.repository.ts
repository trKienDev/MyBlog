import { TagDTO } from "../../dtos/tag.dto";

export interface ITagRepository {
      GetTags(): Promise<TagDTO[]>;
      GetTag_byId(id: string): Promise<TagDTO | null>;
      GetFilmTags(): Promise <TagDTO[]>;
      Create(data: TagDTO): Promise<TagDTO>;
}
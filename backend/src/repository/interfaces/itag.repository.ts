import { TagDTO } from "../../dtos/tag.dto";

export interface ITagRepository {
      GetTags(): Promise<TagDTO[]>;
      Create(data: TagDTO): Promise<TagDTO>;
}
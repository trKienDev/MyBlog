import { TagDTO } from "../../dtos/tag.dto";

export interface ITagRepository {
      Create(data: TagDTO): Promise<TagDTO>;
}
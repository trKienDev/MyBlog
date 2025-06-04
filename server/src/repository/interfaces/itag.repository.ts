import { TagDTO } from "../../dtos/tag.dto";

export interface ITagRepository {
      getTags(): Promise<TagDTO[]>;
      findById(id: string): Promise<TagDTO | null>;
      getTagsByVideo(): Promise<TagDTO[]>
      getTagsByAction(): Promise<TagDTO[]>
      getFilmTags(): Promise <TagDTO[]>;
      createTag(data: TagDTO): Promise<TagDTO>;
}
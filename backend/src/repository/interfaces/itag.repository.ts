import { TagDTO } from "../../dtos/tag.dto";

export interface ITagRepository {
      GetTags(): Promise<TagDTO[]>;
      GetTag_byId(id: string): Promise<TagDTO | null>;
      getTagsByVideo(): Promise<TagDTO[]>
      getTagsByAction(): Promise<TagDTO[]>
      GetFilmTags(): Promise <TagDTO[]>;
      Create(data: TagDTO): Promise<TagDTO>;
}
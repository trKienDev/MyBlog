import { TagDTO } from "../../dtos/tag.dto";

export interface iTagRepository {
      getTags(): Promise<TagDTO[]>;
      findById(id: string): Promise<TagDTO | null>;
      getTagsByVideo(): Promise<TagDTO[]>;
      GetTagsByVideoHomepage(): Promise<TagDTO[]>;
      getTagsByAction(): Promise<TagDTO[]>;
      GetTagsByCreator(): Promise<TagDTO[]>;
      GetTagsByManga(): Promise<TagDTO[]>;
      GetTagsByAnime(): Promise<TagDTO[]>;
      getFilmTags(): Promise <TagDTO[]>;
      createTag(data: TagDTO): Promise<TagDTO>;
      GetTagsByImage(): Promise<TagDTO[]>;
}
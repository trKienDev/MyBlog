import { TagDTO } from "../dtos/tag.dto.js";
import { ITag } from "../models/interface/itag.model.js";
import Tag from "../models/tag.model.js";
import { ITagRepository } from "./interfaces/itag.repository.js";

export class TagRepostory implements ITagRepository{
      async getTags(): Promise<TagDTO[]> {
            const tags = await Tag.find();
            return tags.map(tag => mappingDocToDTO(tag));
      }

      async findById(id: string): Promise<TagDTO | null> {
            const tag = await Tag.findById(id);
            return tag ? mappingDocToDTO(tag) : null;
      }
      
      async getFilmTags(): Promise<TagDTO[]> {
            const tags = await Tag.find({ kind: 'film' });
            return tags.map(tag => mappingDocToDTO(tag));
      }

      async getTagsByVideo(): Promise<TagDTO[]> {
            const tags = await Tag.find({ kind: { $nin: ['film', 'creator', 'action', 'image'] } });
            return tags.map(tag => mappingDocToDTO(tag));
      }

      async GetTagsByVideoHomepage(): Promise<TagDTO[]> {
            const tags = await Tag.find({ kind: { $nin: ['film', 'creator', 'image'] } });
            return tags.map(tag => mappingDocToDTO(tag));
      }

      async getTagsByAction(): Promise<TagDTO[]> {
            const tags = await Tag.find({ kind: 'action' });
            return tags.map(tag => mappingDocToDTO(tag));
      }

      async GetTagsByCreator(): Promise<TagDTO[]> {
            const tags = await Tag.find({ kind: 'creator' });
            return tags.map(tag => mappingDocToDTO(tag));
      }

      async GetTagsByImage(): Promise<TagDTO[]> {
            const tags = await Tag.find({ kind: 'image' });
            return tags.map(tag => mappingDocToDTO(tag));
      }

      async createTag(data: TagDTO): Promise<TagDTO> {
            const tag = new Tag(data);
            const savedTag = await tag.save();
            return mappingDocToDTO(savedTag);
      }
}

function mappingDocToDTO(doc: ITag): TagDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            kind: doc.kind,
      }
}
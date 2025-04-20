import { TagDTO } from "../dtos/tag.dto.js";
import { ITag } from "../models/interface/itag.model.js";
import Tag from "../models/tag.model.js";
import { ITagRepository } from "./interfaces/itag.repository.js";

export class TagRepostory implements ITagRepository{
      public async GetTags(): Promise<TagDTO[]> {
            const tags = await Tag.find();
            return tags.map(tag => MappingDocToDTO(tag));
      }

      public async GetTag_byId(id: string): Promise<TagDTO | null> {
            const tag = await Tag.findById(id);
            return tag ? MappingDocToDTO(tag) : null;
      }
      
      public async GetFilmTags(): Promise<TagDTO[]> {
            const tags = await Tag.find({ kind: 'film' });
            return tags.map(tag => MappingDocToDTO(tag));
      }
      
      public async Create(data: TagDTO): Promise<TagDTO> {
            const tag = new Tag(data);
            const savedTag = await tag.save();
            return MappingDocToDTO(savedTag);
      }
}

function MappingDocToDTO(doc: ITag): TagDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            kind: doc.kind,
      }
}
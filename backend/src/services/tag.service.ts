import { IncomingMessage } from "http";
import { parseJSON } from "../middlewares/json-parser.js";
import { TagDTO } from "../dtos/tag.dto.js";
import { ITagRepository } from "../repository/interfaces/itag.repository.js";

export class TagService {
      private tagRepo: ITagRepository;
      constructor(tagRepository: ITagRepository) {
            this.tagRepo = tagRepository;
      }

      public async createTag(req: IncomingMessage) {
            const requiredFields = ['name', 'kind'];
            const body = await parseJSON(req, requiredFields);
            const { name, kind } = body; 
            if (!name || !kind ) {
                  throw new Error('Missing required information');
            }

            const data: TagDTO = { name, kind };
            
            const newTag = await this.tagRepo.createTag(data);
            return newTag;
      }
}
import { IncomingMessage } from "http";
import { parseJSON } from "../middlewares/json-parser.js";
import { TagDTO } from "../dtos/tag.dto.js";
import { iTagRepository } from "../repositories/interfaces/itag.repository.js";

export class TagService {
      private tagRepo: iTagRepository;
      constructor(tagRepository: iTagRepository) {
            this.tagRepo = tagRepository;
      }

      public async CreateTag(req: IncomingMessage) {
            const required_fields = ['name', 'kind'];
            const body = await parseJSON(req, required_fields);
            const { name, kind } = body; 
            console.log('name: ', name);
            console.log('kind', kind);

            if (!name || !kind ) {
                  throw new Error('Missing required information');
            }

            const data: TagDTO = { name, kind };
            
            const newTag = await this.tagRepo.createTag(data);
            return newTag;
      }
}
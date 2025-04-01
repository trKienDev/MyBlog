import { CodeDTO } from "../dtos/code.dto.js";
import Code from "../models/code.model.js";
import { ICode } from "../models/interface/icode.model.js";
import { ICodeRepository } from "./interfaces/icode.repository.js";

export class CodeRepository implements ICodeRepository {
      public async CreateCode(data: CodeDTO): Promise<CodeDTO> {
            const code = new Code(data);
            const savedCode = await code.save();
            return MappingDocToDTO(savedCode);
      }
}

function MappingDocToDTO(doc: ICode): CodeDTO {
      return {
            _id: doc._id.toString(),
            studio_id: doc.studio_id.toString(),
            code: doc.code,
      }
} 
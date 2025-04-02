import mongoose from "mongoose";
import { CodeDTO } from "../dtos/code.dto.js";
import Code from "../models/code.model.js";
import { iCode } from "../models/interface/icode.model.js";
import { iCodeRepository } from "./interfaces/icode.repository.js";

export class CodeRepository implements iCodeRepository {
      public async GetCodes(): Promise<CodeDTO[]> {
            const codes = await Code.find();
            return codes.map(code => MappingDocToDTO(code));
      }
      public async getCodesByStudio(studioId: string): Promise<CodeDTO[]> {
            const studioObjectId = new mongoose.Types.ObjectId(studioId);
            const codes = await Code.find({studio_id: studioObjectId});
            return codes.map(code => MappingDocToDTO(code));
      }
      public async CreateCode(data: CodeDTO): Promise<CodeDTO> {
            const code = new Code(data);
            const savedCode = await code.save();
            return MappingDocToDTO(savedCode);
      }
}

function MappingDocToDTO(doc: iCode): CodeDTO {
      return {
            _id: doc._id.toString(),
            studio_id: doc.studio_id.toString(),
            code: doc.code,
      }
} 
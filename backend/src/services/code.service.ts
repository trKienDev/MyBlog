import { IncomingMessage } from "http";
import { iCodeRepository } from "../repository/interfaces/icode.repository.js";
import { parseJSON } from "../middlewares/json-parser.js";
import { CodeDTO } from "../dtos/code.dto.js";

export class CodeService {
      private codeRepo: iCodeRepository;
      constructor(codeRepository: iCodeRepository) {
            this.codeRepo = codeRepository;
      }
      
      public async getCodesByStudioId(id: string): Promise<CodeDTO[]> {
            const codes = await this.codeRepo.getCodesByStudio(id);
            if(!codes) {
                  console.error('Error get code by studio in code.service');
                  throw new Error('Code not found.');
            }
            return codes;
      }

      public async CreateCode(req: IncomingMessage) {
            const requiredFileds = ['studio', 'code'];
            const body = await parseJSON(req, requiredFileds);
            const { studio, code } = body;
            
            const data: CodeDTO = { studio_id: studio, code };

            const newCode = await this.codeRepo.CreateCode(data);
            return newCode;
      }
}